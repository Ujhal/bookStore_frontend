import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../mat-element';
import { AdminService } from '../../admin-service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-publisher-update',
  imports: [CommonModule, MaterialModule],
   templateUrl: './publisher-update.html',
  styleUrl: './publisher-update.css'
})
export class PublisherUpdate implements OnInit {

  publishers: any[] = [];

  displayedColumns = [
    'serial',
    'name',
    'email',
    'phone_number',
    'is_verified'
  ];

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    this.loadPublishers();
  }

  loadPublishers(): void {
    this.adminService.getPublisher().subscribe({
      next: (data) => this.publishers = data,
      error: (err) => console.error('Error loading publishers:', err)
    });
  }
}

