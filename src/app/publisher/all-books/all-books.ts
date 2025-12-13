import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../mat-element';
import { PublisherService } from '../publisher.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-all-books',
  imports: [CommonModule, MaterialModule],
  templateUrl: './all-books.html',
  styleUrl: './all-books.css'
})
export class AllBooks implements OnInit {
  books: any[] = [];
  displayedColumns: string[] = ['id', 'title', 'author_name', 'category_name',  'price',];

  constructor(private adminService: PublisherService, private router: Router) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.adminService.getAllBooks().subscribe({
      next: (data) => (this.books = data),
      error: (err) => console.error('Error loading books:', err)
    });
  }
}