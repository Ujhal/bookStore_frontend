import { Component, OnInit } from '@angular/core';
import { CommonService } from '../shared_service/common.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-my-account',
  imports: [CommonModule],
  templateUrl: './my-account.html',
  styleUrl: './my-account.css'
})
export class MyAccount implements  OnInit {

  user: any;
  loading = false;

  constructor(
    private commonService: CommonService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getProfile();
  }

  getProfile(): void {
    this.commonService.getMyProfile().subscribe({
      next: (res) => {
        this.user = res;
      },
      error: () => {
        this.router.navigate(['/login']);
      }
    });
  }

  get isAdmin(): boolean {
    return this.user?.role === 1;
  }

  get isCustomer(): boolean {
    return this.user?.role === 2;
  }

  get isPublisher(): boolean {
    return this.user?.role === 3;
  }

  deleteAccount(): void {
    if (!confirm('Are you sure you want to delete your account?')) {
      return;
    }

    this.loading = true;

    this.commonService.deleteMyAccount().subscribe({
      next: () => {
        localStorage.clear();
        alert('Account deleted successfully');
        this.router.navigate(['/login']);
      },
      error: () => {
        this.loading = false;
        alert('Failed to delete account');
      }
    });
  }
}