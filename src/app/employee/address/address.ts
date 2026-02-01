import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../mat-element';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpHeaders } from '@angular/common/http';
import { EmployeeService } from '../employee-service';
import { CommonService } from '../../shared/shared_service/common.service';

@Component({
  selector: 'app-address',
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './address.html',
  styleUrl: './address.css'
})


export class Address implements OnInit {
  addresses: any[] = [];
  states: any[] = [];
  addressForm!: FormGroup;
  showForm = false;
  editMode = false;
  editId: number | null = null;
  userName: string = '';
  stateMap: { [key: number]: string } = {};


  constructor(private fb: FormBuilder, private http: HttpClient,private employeeService: EmployeeService,private commonService: CommonService) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAddresses();
    this.loadStates();
    this.loadusername()
  }

  initForm() {
  const textPattern = /^[a-zA-Z0-9\s,.-]+$/; // no special characters

  this.addressForm = this.fb.group({
    address_line_1: ['', [
      Validators.required,
      Validators.pattern(textPattern)
    ]],
    address_line_2: ['', Validators.pattern(textPattern)],
    landmark: ['', Validators.pattern(textPattern)],
    city: ['', Validators.required],
    state: ['', Validators.required],
    pincode: ['', [
      Validators.required,
      Validators.pattern(/^[0-9]{6}$/)
    ]],
    phone_number: ['', [
      Validators.required,
      Validators.pattern(/^[0-9]{10}$/)
    ]]
  });
}

loadusername() {
  const userStr = localStorage.getItem('user');

  if (userStr) {
    const user = JSON.parse(userStr);
    this.userName = `${user.first_name} ${user.last_name}`;
  }
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
  
   loadStates() {
  this.commonService.getStates().subscribe({
    next: (res) => {
      this.states = res;

      // Create ID → Name map
      this.stateMap = {};
      res.forEach((s: any) => {
        this.stateMap[s.id] = s.name;
      });
    },
    error: (err) => {
      console.error('Error loading states', err);
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
