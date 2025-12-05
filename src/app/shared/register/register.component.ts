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

export class RegisterComponent {

  form!: FormGroup;
  selectedRole: number = 2;  // Default = Customer

  isEmailRequired: boolean = true;
  isPhoneRequired: boolean = true;

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

  selectRole(role: number): void {
    this.selectedRole = role;
    console.log("Selected Role:", this.selectedRole);
  }

  // Password match
  passwordMatchValidator(group: FormGroup): ValidationErrors | null {
    return group.get('password')?.value === group.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formData = this.form.value;

      let registerData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        middle_name: formData.middleName, // Not needed by backend but sent anyway
        email: formData.email || null,
        phone_number: formData.phone_number || null,
        password: formData.password,
        role: this.selectedRole
      };

      console.log("Registration Payload:", registerData);

      this.authService.register(registerData).subscribe(
        () => {
          this.toaster.success('Registration successful!');
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error("Registration error:", error);
          this.toaster.error(error.error?.detail || 'Registration failed');
        }
      );

    } else {
      this.toaster.error('Please fill out the form correctly.');
    }
  }

  login(): void {
    this.router.navigate(['/login']);
  }
}
