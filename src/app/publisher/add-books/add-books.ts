import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../mat-element';
import { PublisherService } from '../publisher.service';
import { provideNativeDateAdapter } from '@angular/material/core';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-add-books',
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './add-books.html',
  styleUrl: './add-books.css',
  providers: [provideNativeDateAdapter()]

})
export class AddBooks implements OnInit {
  bookForm!: FormGroup;
  authors: any[] = [];
  categories: any[] = [];
  subcategories: any[] = [];
  bookId: number | null = null; // to detect edit mode
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private adminService: PublisherService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author: [null],
      description: [''],
      price: [null],
      currency: ['INR'],
      stock_quantity: [0],
      publisher: [''],
      publication_date: [''],
      language: ['en'],
      pages: [null],
      category: [null],
      subcategory: [null],
      slug: ['', Validators.required],
      cover_image: [null]
    });

    this.loadAuthors();
    this.loadCategories();
    this.loadSubcategories();

    // ✅ Detect edit mode
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.bookId = +id;
        this.isEditMode = true;
        this.loadBookDetails(this.bookId);
      }
    });
  }

  loadAuthors(): void {
    this.adminService.getAuthors().subscribe({
      next: (data) => (this.authors = data),
      error: (err) => console.error('Error loading authors', err)
    });
  }

  loadCategories(): void {
    this.adminService.getCategories().subscribe({
      next: (data) => (this.categories = data),
      error: (err) => console.error('Error loading categories', err)
    });
  }

  loadSubcategories(): void {
    this.adminService.getSubCategories().subscribe({
      next: (data) => (this.subcategories = data),
      error: (err) => console.error('Error loading subcategories', err)
    });
  }

  // ✅ Load book details in edit mode
  loadBookDetails(id: number): void {
    this.adminService.getBookById(id).subscribe({
      next: (book) => {
        // Patch data to the form
        this.bookForm.patchValue({
          ...book,
          publication_date: this.formatDate(this.bookForm.value.publication_date),
        });
      },
      error: (err) => {
        console.error('Error loading book details:', err);
        Swal.fire('Error', 'Failed to load book details.', 'error');
      }
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.bookForm.patchValue({ cover_image: reader.result });
    };
    reader.readAsDataURL(file);
  }

  private formatDate(date: any): string | null {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // YYYY-MM-DD
  }

  onSubmit(): void {
    if (this.bookForm.invalid) return;

    const formData = {
      ...this.bookForm.value,
      publication_date: this.formatDate(this.bookForm.value.publication_date),
      status: 'pending' ,
    };

    if (this.isEditMode && this.bookId) {
      this.updateBook(formData);
    } else {
      this.addBook(formData);
    }
  }

  addBook(formData: any): void {
    this.adminService.saveBooks(formData).subscribe({
      next: () => {
        Swal.fire('Success', 'Book added successfully!', 'success');
        this.bookForm.reset({ currency: 'INR', language: 'en', stock_quantity: 0 });
      },
      error: (error) => {
        console.error('Error saving book:', error);
        Swal.fire('Error', 'Failed to add book.', 'error');
      }
    });
  }

  updateBook(formData: any): void {
    if (!this.bookId) return;
    this.adminService.updateBook(this.bookId, formData).subscribe({
      next: () => {
        Swal.fire('Updated!', 'Book updated successfully.', 'success');
        this.router.navigate(['/books']); // Go back to list
      },
      error: (err) => {
        console.error('Error updating book:', err);
        Swal.fire('Error', 'Failed to update book.', 'error');
      }
    });
  }
}
