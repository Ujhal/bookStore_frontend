import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../mat-element';
import { CommonService } from '../shared_service/common.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toaster: ToastrService,
    private authService: CommonService
  ) {
    // Form initialization with custom validation logic for email or phone
    this.form = this.fb.group({
      username: ['', [
        Validators.required, 
        this.emailOrPhoneValidator
      ]],
      password: ['', Validators.required]
    });

    // Check if the user is already logged in when the component is initialized
    if (localStorage.getItem('isLoggedIn') === 'true') {
      this.router.navigate(['/']);  // Redirect to homepage or dashboard if logged in
    }
  }

  // Custom Validator to validate either email or phone number
  private emailOrPhoneValidator(control: AbstractControl): ValidationErrors | null {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phonePattern = /^[0-9]{10}$/;
    const value = control.value;

    if (value && (emailPattern.test(value) || phonePattern.test(value))) {
      return null;  // Valid input (either email or phone)
    }

    return { invalidEmailOrPhone: true };  // Invalid input
  }

  // Submit form and handle login
  onSubmit(): void {
    if (this.form.valid) {
      const formData = this.form.value;
      const loginData = {
        username: formData.username,
        password: formData.password
      };

      this.authService.login(loginData).subscribe((response: any) => {
  // Store the token for API calls
  localStorage.setItem('token', response.access_token);
  
  // Store the whole user object
  localStorage.setItem('user', JSON.stringify(response.user));

  // Navigate based on role
  switch (response.user.role) {
    case 1:
      this.router.navigate(['/admin']);
      break;
    case 2:
      this.router.navigate(['/customer']);
      break;
    case 3:
      this.router.navigate(['/publisher']);
      break;
  }
});

    } else {
      console.log('Form is invalid');
    }
  }

  // Redirect to Register page
  register(): void {
    this.router.navigate(['register']);
  }

  // Optional: Method to log out and remove 'isLoggedIn' from localStorage
  logout(): void {
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['login']);
  }
}
