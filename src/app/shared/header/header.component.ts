import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../shared_service/common.service';
import { ToastrService } from 'ngx-toastr';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../mat-element';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
enum Role {
  Admin = 1,
  Customer = 2,
  Publisher = 3
}
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, MaterialModule,FormsModule,MatIconModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isLoggedIn = false;
  userName = '';
  userRole: Role | null = null;

  searchQuery = '';

  // Menu items dynamically
  menuItems: { label: string, icon: string, roles: Role[], action: () => void }[] = [];

  constructor(
    private authService: CommonService,
    private router: Router,
    private toastr: ToastrService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Subscribe to login status changes
    this.authService.headerLogin$.subscribe((status: boolean) => {
      this.isLoggedIn = status;

      if (status) {
        this.userName = localStorage.getItem('userName') || 'User';
        this.userRole = Number(localStorage.getItem('role')) as Role || null;
        this.initMenuItems();
      } else {
        this.userName = '';
        this.userRole = null;
        this.menuItems = [];
      }

      this.cdRef.detectChanges();
    });
  }

  /** Initialize menu items based on role */
 /** Initialize menu items based on role */
  private initMenuItems() {
    const allItems = [
      {
        label: 'My Account',
        icon: 'account_circle',
        roles: [Role.Admin, Role.Customer, Role.Publisher],
        action: () => this.goToAccount()
      },
      {
        label: 'Cart',
        icon: 'shopping_cart',
        roles: [Role.Customer], // Only Customer sees Cart
        action: () => this.goToCart()
      },
      {
        label: 'Sign Out',
        icon: 'exit_to_app',
        roles: [Role.Admin, Role.Customer, Role.Publisher],
        action: () => this.logout()
      }
    ];

    // Filter items based on the logged-in user's role
    this.menuItems = allItems.filter(item => this.userRole && item.roles.includes(this.userRole));
  }

  /** Compute home route based on role */
  get homeRoute(): string {
    if (!this.isLoggedIn || !this.userRole) return '/';
    switch (this.userRole) {
      case Role.Admin: return '/admin';
      case Role.Customer: return '/customer';
      case Role.Publisher: return '/publisher';
      default: return '/';
    }
  }

  /** Navigate to home */
  home() {
    this.router.navigate([this.homeRoute]);
  }

  /** Login navigation */
  login() {
    this.router.navigate(['login']);
  }

  /** Account navigation based on role */
  goToAccount() {
    if (!this.userRole) return;
    switch (this.userRole) {
      case Role.Customer:
        this.router.navigate(['/customer/my/account']);
        break;
      case Role.Publisher:
        this.router.navigate(['/publisher/myaccount']);
        break;
      case Role.Admin:
        this.router.navigate(['/admin/myaccount']);
        break;
    }
    
  }

  /** Customer-specific routes */
  goToOrders() {
    this.router.navigate(['/customer/my/orders']);
   
  }

  goToAddresses() {
    this.router.navigate(['/customer/my/addresses']);
    
  }

  goToCart() {
    this.router.navigate(['/customer/my/cart']);
   
  }

  /** Logout */
 logout() {
  localStorage.removeItem('userName');
  localStorage.removeItem('role');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  this.isLoggedIn = false;
  this.userRole = null;
  this.menuItems = [];
  this.router.navigate(['login']);
  this.toastr.success('You have logged out successfully!');
}
  /** Search action */
  search() {
    if (this.searchQuery.trim()) {
      // Example: navigate to a search page
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
    }
  }

  /** Check if a menu item should be visible for current role */
  isMenuItemVisible(item: { roles: Role[] }): boolean {
    if (!this.userRole) return false;
    return item.roles.includes(this.userRole);
  }
}
