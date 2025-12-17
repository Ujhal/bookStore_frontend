import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonService } from '../shared_service/common.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { MaterialModule } from '../../mat-element';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, MaterialModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isLoggedIn: boolean = false;
  UserName: string = '';
  showModal: boolean = false;
  userRole: number = 0; // Store user role
  showCartAndBooks: boolean = false; // Flag to show Cart and Books links
  isCustomer = false;
  isPublisher = false;
  isAdmin = false;

  constructor(
    private authService: CommonService,
    private router: Router,
    private toastr: ToastrService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
  // Subscribe to header login updates
  this.authService.headerLogin$.subscribe((status: boolean) => {
    this.isLoggedIn = status;

    if (status) {
      this.UserName = localStorage.getItem('userName') || 'User';
      const role = Number(localStorage.getItem('role')) || 0;

      this.isCustomer = role === 2;
      this.isPublisher = role === 3;
      this.isAdmin = role === 1;

      this.showCartAndBooks = this.isCustomer;
    } else {
      this.UserName = '';
      this.isCustomer = false;
      this.isPublisher = false;
      this.isAdmin = false;
      this.showCartAndBooks = false;
    }

    this.cdRef.detectChanges();
  });
}


  login() {
    this.router.navigate(['login']);
  }

  home() {
  if (this.isLoggedIn) {
    // Navigate to /customer if logged in
    this.router.navigate(['/customer']);
  } else {
    // Navigate to the root homepage (for non-logged in users)
    this.router.navigate(['']);
  }
}


  // Navigate to orders
  goToOrders() {
    this.router.navigate(['/customer/my/orders']);
    this.showModal = false; // close modal after navigation
  }

  // Navigate to addresses
  goToAddresses() {
    this.router.navigate(['/customer/my/addresses']);
    this.showModal = false; // close modal after navigation
  }

 goToAccount() {
  if (this.isCustomer) {
    this.router.navigate(['/customer/my/account']);
  } else if (this.isPublisher) {
    this.router.navigate(['/publisher/myaccount']);
  } else if (this.isAdmin) {
    this.router.navigate(['/admin/myaccount']);
  }

  this.showModal = false;
}


  goToCart() {
    this.router.navigate(['/customer/my/cart']);
    this.showModal = false; // close modal after navigation
  }

  logout() {
    localStorage.clear();
    this.isLoggedIn = false;
    this.userRole = 0; // Reset the role
    this.showCartAndBooks = false; // Hide Cart and Books links
    this.router.navigate(['login']);
    this.toastr.success('You have logged out successfully!');
  }
}
