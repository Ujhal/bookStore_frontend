import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonService } from '../shared_service/common.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../mat-element';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgotpassword',
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './forgotpassword.html',
  styleUrl: './forgotpassword.css'
})
export class Forgotpassword {
  form: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: CommonService,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      new_password: ['', Validators.required],
      confirm_password: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup) {
    return group.get('new_password')?.value === group.get('confirm_password')?.value
      ? null
      : { notMatching: true };
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.form.valid) {
      const data = this.form.value; // {email, phone_number, new_password, confirm_password}

      this.authService.forgotPassword(data).subscribe({
        next: () => {
          this.successMessage = 'Password reset successfully!';
          setTimeout(() => this.router.navigate(['/login']), 2000); // redirect to login
        },
        error: (err) => {
          this.errorMessage = err.error?.non_field_errors?.[0] || 'Something went wrong';
        }
      });
    } else {
      this.errorMessage = 'Please fill all fields correctly.';
    }
  }

  login(): void {
    this.router.navigate(['/login']);
  }
}
