import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../mat-element';
import { PublisherService } from '../publisher.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-books-update',
  imports: [CommonModule, MaterialModule],
  templateUrl: './books-update.html',
  styleUrl: './books-update.css'
})
export class BooksUpdate implements OnInit {
  books: any[] = [];
  displayedColumns: string[] = ['id', 'title', 'author_name', 'category_name', 'status','stock_quantity', 'price', 'actions'];

  constructor(private adminService: PublisherService, private router: Router) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.adminService.getMyBooks().subscribe({
      next: (data) => (this.books = data),
      error: (err) => console.error('Error loading books:', err)
    });
  }

  onDelete(bookId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the book.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.deleteBook(bookId).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Book deleted successfully.', 'success');
            this.loadBooks();
          },
          error: (error) => {
            console.error('Error deleting book:', error);
            Swal.fire('Error', 'Failed to delete book.', 'error');
          }
        });
      }
    });
  }

 onEdit(book: any): void {
  this.router.navigate(['/publisher/books/edit', book.id]);
}
}