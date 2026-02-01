import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../mat-element';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [RouterOutlet, MaterialModule, RouterModule, CommonModule],
})
export class DashboardComponent implements OnInit {
  toggleSidebar: boolean = true;

 

  // Menu items for Book Management
  bookMenu = [
    { label: 'All Books', icon: 'book', link: '/admin/masters/books' },
    { label: 'Add New Book', icon: 'add_circle', link: '/admin/masters/add-books' },
    { label: 'Categories', icon: 'category', link: '/admin/masters/categories' },
    { label: 'Subcategories', icon: 'subdirectory_arrow_right', link: '/admin/masters/sub-categories' },
    { label: 'Manage Reviews', icon: 'rate_review', link: '/admin/reviews' },
  ];

   authorMenu = [
    { label: 'All Authors', icon: 'person', link: '/admin/masters/authors' },
    { label: 'Add New Author', icon: 'add_circle', link: '/admin/masters/add-authors' },
  ];

   publisherMenu = [
    { label: 'All Publisher', icon: 'person', link: '/admin/masters/publisher' },
  ];

  orderMenu = [
    { label: 'All orders', icon: 'person', link: '/admin/orders/allOrders' },
    { label: 'Pending Orders',  icon:'person',link:'/admin/orders/myOrders'},
    { label: 'Shipped Orders', icon: 'add_circle', link: '/admin/orders/shipped-Orders' },
    { label: 'Delivered Orders', icon: 'add_circle', link: '/admin/orders/delivered-Orders' },
    { label: 'Cancelled Orders', icon: 'add_circle', link: '/admin/orders/cancelled-Orders' },
    { label: 'My Orders', icon: 'add_circle', link: '/admin/orders/All-Orders' },

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
