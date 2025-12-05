import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../mat-element';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../admin-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './add-category.html',
  styleUrl: './add-category.css'
})
export class AddCategory implements OnInit {
  categoryForm!: FormGroup;
  categories: any[] = []; // Array to hold category data
  displayedColumns: string[] = ['id', 'name', 'is_active']; // Columns for the table

  constructor(private fb: FormBuilder, private adminService: AdminService) {}

  ngOnInit(): void {
    this.get_categories();
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  // Form submission to add a new category
  onSubmit(): void {
    if (this.categoryForm.valid) {
      const categoryName = this.categoryForm.value.name;

      // Prompt the user to confirm before submitting the category
      Swal.fire({
        title: 'Are you sure?',
        text: `Do you really want to add the category "${categoryName}"?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, add it!',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          console.log('Submitting Category:', categoryName);

          this.adminService.saveCategory({ name: categoryName }).subscribe({
            next: (response) => {
              console.log('Category added successfully:', response);
              this.categoryForm.reset();
              // Refresh the category list after adding new one
              this.get_categories();
            },
            error: (error) => {
              console.error('Error adding category:', error);
            }
          });
        } else {
          console.log('Category addition cancelled.');
        }
      });
    }
  }

  // Fetch categories from the backend
  get_categories(): void {
    this.adminService.getCategories().subscribe(categories => {
      console.log('Categories:', categories);
      this.categories = categories; // Store fetched categories in array
    });
  }

  // Toggle the activation status of a category
  onToggleStatus(category: any, event: any): void {
    const newStatus = event.checked;
    if (!newStatus) {
      // If the user is deactivating the category, show the confirmation prompt
      Swal.fire({
        title: 'Are you sure?',
        text: `Do you really want to deactivate the category "${category.name}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, deactivate it!',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          console.log(`Category ${category.name} deactivated`);
          this.deactivateCategory(category);
        } else {
          event.source.checked = true;
        }
      });
    } else {
      console.log(`Category ${category.name} activated`);
      this.activateCategory(category);
    }
  }

  // Deactivate the category
  deactivateCategory(category: any): void {
    // Make an API call to deactivate the category
    console.log('Category deactivated successfully');
    // this.adminService.updateCategoryStatus(category.id, { is_active: false }).subscribe({
    //   next: (response) => {
    //     console.log('Category deactivated successfully');
    //     this.get_categories();
    //   },
    //   error: (error) => {
    //     console.error('Error deactivating category:', error);
    //   }
    // });
  }

  // Activate the category
  activateCategory(category: any): void {
    console.log('Category activated successfully');
    // Make an API call to activate the category
    // this.adminService.updateCategoryStatus(category.id, { is_active: true }).subscribe({
    //   next: (response) => {
    //     console.log('Category activated successfully');
    //     this.get_categories();
    //   },
    //   error: (error) => {
    //     console.error('Error activating category:', error);
    //   }
    // });
  }
}
