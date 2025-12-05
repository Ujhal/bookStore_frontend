
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../mat-element';
import { AdminService } from '../../admin-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-subcategory',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './add-subcategory.html',
  styleUrls: ['./add-subcategory.css']
})
export class AddSubcategory implements OnInit {
  subCategoryForm!: FormGroup;
  subcategories: any[] = [];
  categories: any[] = [];
  displayedColumns: string[] = ['id', 'name', 'category', 'is_active'];

  constructor(private fb: FormBuilder, private adminService: AdminService) {}

  ngOnInit(): void {
    this.get_categories();
    this.get_subcategories();

    this.subCategoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      category: ['', Validators.required]
    });
  }

  // Add new subcategory
  onSubmit(): void {
    if (this.subCategoryForm.valid) {
      const { name, category } = this.subCategoryForm.value;

      Swal.fire({
        title: 'Are you sure?',
        text: `Do you really want to add subcategory "${name}"?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, add it!',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          const payload = { name, category };

          this.adminService.saveSubCategory(payload).subscribe({
            next: (response) => {
              console.log('Subcategory added successfully:', response);
              Swal.fire('Success', 'Subcategory added successfully!', 'success');
              this.subCategoryForm.reset();
              this.get_subcategories();
            },
            error: (error) => {
              console.error('Error adding subcategory:', error);
              Swal.fire('Error', 'Failed to add subcategory.', 'error');
            }
          });
        }
      });
    }
  }

  // Fetch all categories for dropdown
  get_categories(): void {
    this.adminService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => console.error('Error fetching categories:', error)
    });
  }

  // Fetch existing subcategories
  get_subcategories(): void {
    this.adminService.getSubCategories().subscribe({
      next: (subcategories) => {
        this.subcategories = subcategories;
      },
      error: (error) => console.error('Error fetching subcategories:', error)
    });
  }

  // Toggle active/inactive
  onToggleStatus(subcategory: any, event: any): void {
    const newStatus = event.checked;
    if (!newStatus) {
      Swal.fire({
        title: 'Are you sure?',
        text: `Do you want to deactivate subcategory "${subcategory.name}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, deactivate',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.updateStatus(subcategory, false);
        } else {
          event.source.checked = true;
        }
      });
    } else {
      this.updateStatus(subcategory, true);
    }
  }

  // Update activation status
  updateStatus(subcategory: any, isActive: boolean): void {
    console.log(`Updating status of ${subcategory.name} to ${isActive}`);
    // this.adminService.updateSubCategoryStatus(subcategory.id, { is_active: isActive }).subscribe({
    //   next: (response) => {
    //     console.log('Status updated:', response);
    //     this.get_subcategories();
    //   },
    //   error: (error) => console.error('Error updating status:', error)
    // });
  }
}
