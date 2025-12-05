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

  constructor(
    private authService: CommonService,
    private router: Router,
    private toastr: ToastrService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
  // Check if the user is logged in from localStorage
  const loggedInStatus = localStorage.getItem('isLoggedIn');
  this.isLoggedIn = loggedInStatus === 'true'; // true if logged in, false otherwise

  if (this.isLoggedIn) {
    // Retrieve the username and role from localStorage if logged in
    this.UserName = localStorage.getItem('username') || 'User'; // Default to 'User' if no name found
    this.userRole = Number(localStorage.getItem('role')) || 0; // Default to 0 if no role found

    // Show Cart and Books only if the role is 2
    this.showCartAndBooks = this.userRole === 2;
  }

  // Manually trigger change detection
  this.cdRef.detectChanges();  // This ensures that Angular updates the view after `localStorage` values are set.
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
    this.router.navigate(['/customer/my/account']);
    this.showModal = false; // close modal after navigation
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
