import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../mat-element';
import { EmployeeService } from '../../../employee-service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ValidationPatterns } from '../../../../shared/shared_service/pattern_constants';

@Component({
  selector: 'app-personal-details',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, MatDatepickerModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.css']
})
export class PersonalDetailsComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @ViewChild('fileInput') fileInput!: ElementRef;
  
  districts: any[] = [];
  isLoading = true;
  selectedFilePhotoName = '';
  maxFileSizeMB = 5; // Maximum allowed file size in MB
  allowedFileTypes = ['image/jpeg', 'image/png'];

  constructor(private fb: FormBuilder, private employeeService: EmployeeService) {}
  today: Date = new Date();

  ngOnInit(): void {
    this.get_districts();
    this.setupExpiryDateLogic();
  }

  get_districts(): void {
    this.isLoading = true;
    this.employeeService.getDistricts().subscribe({
      next: (districts) => {
        this.districts = districts;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load districts:', err);
        this.isLoading = false;
      }
    });
  }

  setupExpiryDateLogic(): void {
    const isAliveControl = this.formGroup.get('is_alive');
    const expiryDateControl = this.formGroup.get('expiry_date');

    if (isAliveControl && expiryDateControl) {
      isAliveControl.valueChanges.subscribe(isAlive => {
        if (isAlive) {
          expiryDateControl.disable();
          expiryDateControl.reset();
        } else {
          expiryDateControl.enable();
        }
      });

      // Initialize state
      if (isAliveControl.value) {
        expiryDateControl.disable();
      }
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      
      // Validate file size
      if (file.size > this.maxFileSizeMB * 1024 * 1024) {
        alert(`File size exceeds ${this.maxFileSizeMB}MB limit`);
        this.clearFileInput();
        return;
      }

      // Validate file type
      if (!this.allowedFileTypes.includes(file.type)) {
        alert('Only JPEG/PNG images are allowed');
        this.clearFileInput();
        return;
      }

      this.selectedFilePhotoName = file.name;
      
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        this.formGroup.patchValue({ 
          sainik_photo: base64String
        });
      };
      reader.onerror = () => {
        console.error('Error reading file');
        this.clearFileInput();
      };
      reader.readAsDataURL(file);
    }
  }

  clearFileInput(): void {
    this.selectedFilePhotoName = '';
    this.formGroup.patchValue({ sainik_photo: null });
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  triggerFileInput(): void {
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    }
  }

  removePhoto(): void {
    this.clearFileInput();
  }
  onPhoneInput(event: KeyboardEvent): void {
  const input = event.target as HTMLInputElement;
  const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];

  // Allow navigation/edit keys
  if (allowedKeys.includes(event.key)) {
    return;
  }

  // If key is not a digit, prevent input
  if (!/\d/.test(event.key)) {
    event.preventDefault();
    return;
  }

  // Prevent input if length already 10
  if (input.value.length >= 10) {
    event.preventDefault();
  }
}
onPinInput(event: KeyboardEvent): void {
  const input = event.target as HTMLInputElement;
  const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];

  if (allowedKeys.includes(event.key)) {
    return;
  }

  if (!/\d/.test(event.key)) {
    event.preventDefault();
    return;
  }

  if (input.value.length >= 6) {
    event.preventDefault();
  }
}
onNameInput(event: KeyboardEvent): void {
  const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete', ' ']; // allow space too

  if (allowedKeys.includes(event.key)) {
    return;
  }

  if (!/^[a-zA-Z]$/.test(event.key)) {
    event.preventDefault();
  }
}
preventManualInput(event: KeyboardEvent): void {
  event.preventDefault();
}

onAadharKeydown(event: KeyboardEvent): void {
  const allowedKeys = [
    'Backspace',
    'Delete',
    'ArrowLeft',
    'ArrowRight',
    'Tab',
  ];

  if (allowedKeys.includes(event.key)) {
    return; // allow control keys
  }

  // Prevent if not digit
  if (!/\d/.test(event.key)) {
    event.preventDefault();
    return;
  }

  const input = event.target as HTMLInputElement;

  // Prevent input if length is already 12
  if (input.value.length >= 12) {
    event.preventDefault();
  }
}

}