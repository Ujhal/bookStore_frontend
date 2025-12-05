import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../mat-element';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpHeaders } from '@angular/common/http';
import { EmployeeService } from '../employee-service';

@Component({
  selector: 'app-address',
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './address.html',
  styleUrl: './address.css'
})


export class Address implements OnInit {
  addresses: any[] = [];
  addressForm!: FormGroup;
  showForm = false;
  editMode = false;
  editId: number | null = null;
  userName = 'Ujhal Giri'; // can come from auth service

  constructor(private fb: FormBuilder, private http: HttpClient,private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAddresses();
  }

  initForm() {
    this.addressForm = this.fb.group({
      address_line_1: ['', Validators.required],
      address_line_2: [''],
      landmark: [''],
      pincode: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      phone_number: ['', Validators.required]
    });
  }

   loadAddresses() {
    this.employeeService.getAddresses().subscribe({
      next: (res) => {
        this.addresses = res;
      },
      error: (err) => {
        console.error('Error loading addresses', err);
      }
    });
  }

  openAddForm() {
    this.showForm = true;
    this.editMode = false;
    this.addressForm.reset();
  }

  editAddress(addr: any) {
    this.showForm = true;
    this.editMode = true;
    this.editId = addr.id;
    this.addressForm.patchValue(addr);
  }

  cancelForm() {
    this.showForm = false;
    this.editMode = false;
    this.addressForm.reset();
  }

 saveAddress() {
    if (this.addressForm.invalid) return;

    const data = this.addressForm.value;

    if (this.editMode && this.editId) {
      // For editing an address
      this.employeeService.editAddress(this.editId, data).subscribe({
        next: () => {
          this.loadAddresses();
          this.cancelForm();
        },
        error: (err) => {
          console.error('Error updating address', err);
        }
      });
    } else {
      // For saving a new address
      this.employeeService.saveAddress(data).subscribe({
        next: () => {
          this.loadAddresses();
          this.cancelForm();
        },
        error: (err) => {
          console.error('Error saving address', err);
        }
      });
    }
  }

 
}
