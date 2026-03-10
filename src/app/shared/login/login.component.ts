import { Component } from '@angular/core';
import { Router,RouterModule  } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../mat-element';
import { CommonService } from '../shared_service/common.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule,RouterModule ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
 export class LoginComponent {
  form: FormGroup;
  errorMessage: string = ''; // for API errors

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toaster: ToastrService,
    private authService: CommonService
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, this.emailOrPhoneValidator]],
      password: ['', Validators.required]
    });

    if (localStorage.getItem('isLoggedIn') === 'true') {
      this.router.navigate(['/']);
    }
  }

  private emailOrPhoneValidator(control: AbstractControl): ValidationErrors | null {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phonePattern = /^[0-9]{10}$/;
    const value = control.value;
    if (value && (emailPattern.test(value) || phonePattern.test(value))) return null;
    return { invalidEmailOrPhone: true };
  }

  onSubmit(): void {
    this.errorMessage = ''; // reset previous error
    if (this.form.valid) {
      const loginData = this.form.value;

      this.authService.login(loginData).subscribe({
        next: (response: any) => {
          localStorage.setItem('token', response.access_token);
          localStorage.setItem('user', JSON.stringify(response.user));

          switch (response.user.role) {
            case 1: this.router.navigate(['/admin']); break;
            case 2: this.router.navigate(['/customer']); break;
            case 3: this.router.navigate(['/publisher']); break;
          }
        },
        error: (err) => {
          // Assuming API returns JSON with non_field_errors array
          if (err.error && err.error.non_field_errors && err.error.non_field_errors.length) {
            this.errorMessage = err.error.non_field_errors[0]; // display first error
          } else {
            this.errorMessage = 'Something went wrong. Please try again.';
          }
        }
      });

    } else {
      this.errorMessage = 'Please fill in all fields correctly.';
    }
  }

  register(): void { this.router.navigate(['register']); }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['login']);
  }
}