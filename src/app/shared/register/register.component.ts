import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../mat-element';
import { CommonService } from '../shared_service/common.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

// register.component.ts
export class RegisterComponent {
  form!: FormGroup;
  selectedRole: number | null = null; // no default role
  showForm: boolean = false;          // controls whether the full form is shown

  apiError: string = '';
  registrationSuccess: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toaster: ToastrService,
    private authService: CommonService
  ) {
    this.form = this.fb.group({
      first_name: ['', Validators.required],
      middleName: [''],
      last_name: ['', Validators.required],
      email: ['', [Validators.email]],
      phone_number: ['', [Validators.pattern('^[0-9]{10}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Step 1: select role
  selectRole(role: number): void {
    this.selectedRole = role;
    this.showForm = true; // show rest of the form
    console.log("Selected Role:", this.selectedRole);
  }

  // Password match validator
  passwordMatchValidator(group: FormGroup) {
    return group.get('password')?.value === group.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit(): void {
    this.apiError = '';
    if (!this.selectedRole) {
      this.toaster.error('Please select a role first.');
      return;
    }

    if (this.form.valid) {
      const formData = this.form.value;

      const registerData = {
        first_name: formData.first_name,
        middle_name: formData.middleName,
        last_name: formData.last_name,
        email: formData.email || null,
        phone_number: formData.phone_number || null,
        password: formData.password,
        role: this.selectedRole
      };

      this.authService.register(registerData).subscribe({
        next: () => {
          this.registrationSuccess = true;
          setTimeout(() => this.router.navigate(['/login']), 3000);
        },
        error: (err) => {
          const errorData = err?.error;
          if (errorData?.email?.length) this.apiError = errorData.email[0];
          else if (errorData?.phone_number?.length) this.apiError = errorData.phone_number[0];
          else this.apiError = 'Registration failed. Please try again.';
        }
      });
    } else {
      this.toaster.error('Please fill out the form correctly.');
    }
  }

  login(): void {
    this.router.navigate(['/login']);
  }
}