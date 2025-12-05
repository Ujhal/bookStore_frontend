import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../mat-element';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AdminService } from '../admin-service';

@Component({
  selector: 'app-dashboard-data',
  standalone: true,
  imports: [RouterOutlet, MaterialModule, RouterModule, CommonModule],
  templateUrl: './dashboard-data.component.html',
  styleUrls: ['./dashboard-data.component.css']
})
export class DashboardDataComponent implements OnInit {

  toggleSidebar: boolean = true;

  // Dashboard data
  totalBooks = 0;
  totalAuthors = 0;
  totalCategories = 0;
  totalSubcategories = 0;
  totalReviews = 0;

  categoryWiseBooks: any[] = [];
  subcategoryWiseBooks: any[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.fetchDashboardData();
  }

  fetchDashboardData() {
    this.adminService.getCount().subscribe({
      next: (data) => {
        this.totalBooks = data.total_books;
        this.totalAuthors = data.total_authors;
        this.totalCategories = data.total_categories;
        this.totalSubcategories = data.total_subcategories;
        this.totalReviews = data.total_reviews;
        this.categoryWiseBooks = data.category_wise_books;
        this.subcategoryWiseBooks = data.subcategory_wise_books;
      },
      error: (err) => {
        console.error('Error fetching dashboard stats:', err);
      }
    });
  }
}
