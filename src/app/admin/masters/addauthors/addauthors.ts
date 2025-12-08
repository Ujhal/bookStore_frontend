import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../mat-element';
import { AdminService } from '../../admin-service';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';   // <-- import ActivatedRoute

import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-author',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './addauthors.html',
  styleUrls: ['./addauthors.css'],
  providers: [provideNativeDateAdapter()]
})
export class AddAuthors implements OnInit {
  authorForm!: FormGroup;
  authors: any[] = [];
  isEditMode = false;
  currentAuthorId: number | null = null;

  // Inject ActivatedRoute here
  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.authorForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      biography: [''],
      date_of_birth: [''],
      date_of_death: [''],
      nationality: [''],
      photo: [null],
    });

    this.get_authors();

    // Subscribe to route params AFTER form initialization
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.currentAuthorId = +id;
        this.loadAuthorData(this.currentAuthorId);
      }
    });
  }

  loadAuthorData(authorId: number): void {
    this.adminService.getAuthorById(authorId).subscribe({
      next: (authorDetails) => {
        this.authorForm.patchValue({
           ...authorDetails,
            date_of_birth: this.formatDate(this.authorForm.value.date_of_birth),
            date_of_death: this.formatDate(this.authorForm.value.date_of_death),
        });
      },
      error: (error) => {
        console.error('Error fetching author details:', error);
        Swal.fire('Error', 'Failed to fetch author details.', 'error');
      }
    });
  }

  onSubmit(): void {
    if (!this.authorForm.valid) return;

    const authorData = this.authorForm.value;
    const formattedData = {
      ...authorData,
      date_of_birth: this.formatDate(authorData.date_of_birth),
      date_of_death: this.formatDate(authorData.date_of_death),
      is_publisher: false
    };

    if (this.isEditMode && this.currentAuthorId) {
      Swal.fire({
        title: 'Confirm Update Author',
        text: `Update author "${authorData.name}"?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, update it!',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.adminService.updateAuthor(this.currentAuthorId!, formattedData).subscribe({
            next: () => {
              Swal.fire('Updated!', 'Author updated successfully.', 'success');
              this.resetForm();
              this.get_authors();
            },
            error: (error) => {
              console.error('Error updating author:', error);
              Swal.fire('Error', 'Failed to update author.', 'error');
            }
          });
        }
      });
    } else {
      Swal.fire({
        title: 'Confirm Add Author',
        text: `Add author "${authorData.name}"?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, add it!',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.adminService.saveAuthor(formattedData).subscribe({
            next: () => {
              Swal.fire('Success', 'Author added successfully!', 'success');
              this.resetForm();
              this.get_authors();
            },
            error: (error) => {
              console.error('Error adding author:', error);
              Swal.fire('Error', 'Failed to add author.', 'error');
            }
          });
        }
      });
    }
  }

  onCancel(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.authorForm.reset();
    this.isEditMode = false;
    this.currentAuthorId = null;
  }

  get_authors(): void {
    this.adminService.getAuthors().subscribe({
      next: (authors) => {
        this.authors = authors;
      },
      error: (error) => console.error('Error fetching authors:', error)
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.authorForm.patchValue({ photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }

  private formatDate(date: any): string | null {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // YYYY-MM-DD
  }
}
