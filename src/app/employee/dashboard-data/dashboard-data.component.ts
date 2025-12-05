import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee-service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MaterialModule } from '../../mat-element';

@Component({
  selector: 'app-dashboard-data',
  standalone: true,
  imports: [CommonModule,MaterialModule],
  templateUrl: './dashboard-data.component.html',
  styleUrl: './dashboard-data.component.css'
})
export class DashboardDataComponent 
   implements OnInit {
  books: any[] = [];

  constructor(private commonService: EmployeeService,private router:Router) {}

  ngOnInit(): void {
    this.loadBooks();
    console.log('i am logged in')
  }

  loadBooks(): void {
    this.commonService.getBooks().subscribe({
      next: (data) => (this.books = data),
      error: (err) => console.error('Error loading books:', err)
    });
  }
  viewBook(id: number): void {
  this.router.navigate(['/customer/viewbook', id]);
}
}
