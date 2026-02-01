import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../mat-element';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, MaterialModule, RouterModule, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  toggleSidebar: boolean = true;

 

  // Menu items for Book Management
  bookMenu = [
    { label: 'My Books', icon: 'book', link: '/publisher/my-books' },
    { label: 'All Books', icon: 'book', link: '/publisher/all-books' },
    { label: 'Add New Book', icon: 'add_circle', link: '/publisher/add-books' },
    
  ];

   authorMenu = [
    { label: 'All Authors', icon: 'person', link: '/publisher/all-authors' },
    { label: 'Add New Author', icon: 'add_circle', link: '/publisher/masters/add-authors' },
  ];
  orderMenu = [
    { label: 'All orders', icon: 'person', link: '/publisher/orders/all-orders' },
    { label: 'Pending Orders', icon: 'add_circle', link: '/publisher/orders/pending-Orders' },
    { label: 'Shipped Orders', icon: 'add_circle', link: '/publisher/orders/shipped-Orders' },
    { label: 'Delivered Orders', icon: 'add_circle', link: '/publisher/orders/delivered-Orders' },
   

  ];

  ngOnInit(): void {
    // Fetch dashboard data from backend (optional)
    // Example: this.fetchDashboardData();
  }

  // Example method to fetch data
  fetchDashboardData() {
    // Call your API here to get data for books, authors, reviews, etc.
    // For example:
    // this.dashboardService.getDashboardData().subscribe((data) => {
    //   this.totalBooks = data.books;
    //   this.totalAuthors = data.authors;
    //   this.totalReviews = data.reviews;
    //   this.totalCategories = data.categories;
    // });
  }
}
