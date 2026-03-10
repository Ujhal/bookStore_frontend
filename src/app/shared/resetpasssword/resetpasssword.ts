import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../shared_service/common.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../mat-element';

@Component({
  selector: 'app-resetpasssword',
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './resetpasssword.html',
  styleUrl: './resetpasssword.css'
})
export class Resetpasssword{
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
      old_password: ['', Validators.required],
      new_password: ['', Validators.required],
      confirm_password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.form.valid) {
      const payload = this.form.value;

      this.authService.changePassword(payload).subscribe({
        next: (res: any) => {
          this.successMessage = 'Password changed successfully.';
          this.form.reset();
          this.toastr.success('Password updated!');
        },
        error: (err) => {
          if (err.error) {
            // Display serializer error from Django
            this.errorMessage = Object.values(err.error).flat().join(' ');
          } else {
            this.errorMessage = 'Something went wrong. Please try again.';
          }
        }
      });
    } else {
      this.errorMessage = 'Please fill in all fields correctly.';
    }
  }

  backToProfile(): void {
    this.router.navigate(['/profile']);
  }
}