import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../employee-service';
import { PersonalDetails, ServiceDetails, SainikFormData,BankDetails,DependentDetails,AwardDetails,EducationalDetails,EsmInfo} from './models/sainik.models';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../mat-element';
import { PersonalDetailsComponent } from './steps/personal-details/personal-details.component';
import { ReviewSummaryComponent } from './steps/review-summary/review-summary.component';
import { ServiceDetailsComponent } from './steps/service-details/service-details.component';
import { BankDetailsComponent } from './steps/bank-details/bank-details.component';
import { DependentDetailsComponent } from './steps/dependent-details/dependent-details.component';
import { AdditionalDetailsComponent } from './steps/additional-details/additional-details.component';
import { EducationDetailsComponent } from './steps/education-details/education-details.component';
import { formatDate } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { Router } from '@angular/router'; // For routing


@Component({
  selector: 'app-sainik-form',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    PersonalDetailsComponent,
    ServiceDetailsComponent,
    ReviewSummaryComponent,
    BankDetailsComponent,
    DependentDetailsComponent,
    AdditionalDetailsComponent,
    EducationDetailsComponent
  ],
  templateUrl: './sainik-form.component.html',
  styleUrls: ['./sainik-form.component.css']
})
export class SainikFormComponent implements OnInit {
  personalForm!: FormGroup;
  serviceForm!: FormGroup;
  bankForm!: FormGroup;
  dependentForm!: FormGroup;
  additionalForm!: FormGroup;
  awardForm!: FormGroup;
  educationForm!: FormGroup;
  esmInfoForm!: FormGroup;
  serviceRecords: ServiceDetails[] = [];
  bankRecords: BankDetails[] = [];
  dependentRecords: DependentDetails[] = [];
  awardRecords: AwardDetails[] = [];
  educationRecords: EducationalDetails[] = [];
  esmInfoRecords: EsmInfo[] = [];

  // Stepper Control
  currentStep = 0;

constructor(
  private fb: FormBuilder,
  private employeeService: EmployeeService,
  private snackBar: MatSnackBar,
  private router: Router
) {}


  ngOnInit(): void {
    this.initForms();
  }

  private initForms(): void {
    this.initPersonalForm();
    this.initServiceForm();
    this.initBankDetailsForm();
    this.initDependentForm();
    this.initAdditionalForm();
    this.initAwardForm()
    this.initEducationForm();
    this.initEsmInfoForm();
  
  }

  private initPersonalForm(): void {
    this.personalForm = this.fb.group({
      id_ic: ['', ],
      first_name: ['', ],
      middle_name: [''],
      last_name: ['', ],
      date_of_birth: ['', ],
      district: [null],
      address: ['', ],
      address_line_2: ['', ],
      village: ['', ],    
      post_office: ['', ],
      pin_code: ['', [,]],
      phone_number: ['', []],
      email: ['', ],
      aadhar_number: ['', []],
      is_alive: [true],
      expiry_date: [null],
      sainik_photo: [null] // File input for sainik photo
    });

    // Conditional expiry date validation
    this.personalForm.get('is_alive')?.valueChanges.subscribe(isAlive => {
      const expiryControl = this.personalForm.get('expiry_date');
      isAlive ? expiryControl?.disable() : expiryControl?.enable();
    });
  }

  private initServiceForm(): void {
    this.serviceForm = this.fb.group({
      corps: [null, ],
      commission: [null],
      unit: [''],
      description: ['', ],
      start_date: ['', ],
      end_date: ['', ],
      ppo_number: ['',],
      ppo_image: [null] 
    });
  }

  private initBankDetailsForm(): void {
    this.bankForm = this.fb.group({
      account_number: ['', ],
      pan_number: ['', ],
      bank_name: ['', ],
      branch_name: ['', ],
      ifsc_code: ['', ],
      account_type: ['', ],

    });
  }
  private initDependentForm(): void {
  this.dependentForm = this.fb.group({
    first_name: ['', ],
    last_name: ['', ],
    relation: ['', ],
    date_of_birth: ['',],
    employment_status: ['',]
  });
}
private initAdditionalForm(): void {
  this.additionalForm = this.fb.group({
    canteen_smart_card: [false],
    coi: [false],
    resident_certificate: [false],
    echs: [false],
  });
}
private initEducationForm(): void {
  this.educationForm = this.fb.group({
    qualificationLevel: [null],
    qualification: [''],
    remarks: [null]
  });
}
  

 private initAwardForm(): void {
  this.awardForm = this.fb.group({
    category: [null],
    award_type: [null],
    received_date: [null],
    remarks: [''],
    award_image: [null] ,
    award_name: [null],
    certificate_name:[null]
  });
}

 private initEsmInfoForm(): void {
  this.esmInfoForm = this.fb.group({
    esm_number: [null],
    esm_issue_date: [null],
    esm_place_of_issue: [null],
    issue_number: [null]
  });
}
  

  addServiceRecord(): void {
    if (this.serviceForm.valid) {
      this.serviceRecords.push(this.serviceForm.value);
      this.serviceForm.reset();
    }
  }
  addBankRecord(): void {
    if (this.bankForm.valid) {
      this.bankRecords.push(this.bankForm.value);
      this.bankForm.reset();
    }
  }
  addDependentRecord(): void {
  if (this.dependentForm.valid) {
    this.dependentRecords.push(this.dependentForm.value);
    this.dependentForm.reset();
  }
}
  addEducationRecord(): void {
  if (this.educationForm.valid) {
    this.educationRecords.push(this.educationForm.value);
    this.educationForm.reset();
  }
}
addEsmRecord(): void {
  if (this.esmInfoForm.valid) {
    this.esmInfoRecords.push(this.esmInfoForm.value);
    this.esmInfoForm.reset();
  }
} 
 addAwardRecord(): void {
  if (this.awardForm.valid) {
    this.awardRecords.push(this.awardForm.value);
    this.awardForm.reset();
  }
}
private showMessage(message: string): void {
  this.snackBar.open(message, 'Close', {
    duration: 3000, // in milliseconds
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
  });
}

submitForm(): void {
  if (this.personalForm.invalid) {
    this.showMessage('Personal form is invalid.');
    return;
  }
  const personalDetails = {
    ...this.personalForm.value,
    date_of_birth: this.formatDate(this.personalForm.value.date_of_birth),
    expiry_date: this.formatDate(this.personalForm.value.expiry_date)
  };

  const service_details = this.serviceRecords.map(service => ({
    ...service,
    id_ic: personalDetails.id_ic,
    start_date: this.formatDate(service.start_date),
    end_date: this.formatDate(service.end_date)
  }));

  const bank_details = this.bankRecords.map(bank => ({
    ...bank,
    id_ic: personalDetails.id_ic
  }));

  const education_details = this.educationRecords.map(edu => ({
    ...edu,
    id_ic: personalDetails.id_ic,
    yearOfPassing: this.formatYear(edu.yearOfPassing)
  }));

  const dependents = this.dependentRecords.map(dep => ({
    ...dep,
    id_ic: personalDetails.id_ic,
    date_of_birth: this.formatDate(dep.date_of_birth)
  }));

  const awards = this.awardRecords.map(award => ({
    ...award,
    id_ic: personalDetails.id_ic,
    received_date: this.formatDate(award.received_date)
  }));

   const esm_info = this.esmInfoRecords.map(esm => ({
     ...esm,
     id_ic: personalDetails.id_ic,
     esm_issue_date: this.formatDate(esm.esm_issue_date)

   }));

  const additional_details = {
    ...this.additionalForm.value,
    id_ic: personalDetails.id_ic,
  };

  const finalPayload = {
  ...personalDetails,
  service_details: service_details || [],
  bank_details: bank_details || [],
  dependents: dependents || [],
  additional_details: additional_details || null,
  education_details: education_details || [],
  esm_info: esm_info || [],
  awards: awards || []
};


  this.employeeService.submitSainikData(finalPayload).subscribe({
    next: response => {
      Swal.fire({
        title: 'Success!',
        text: 'Form submitted successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#1976d2',
      }).then(() => {
        this.router.navigate(['/dashboard/registerSainiks']);
      });
    },
    error: err => {
      console.error('Submission failed:', err);
      Swal.fire({
        title: 'Submission Failed',
        text: 'Something went wrong. Please review your form.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#d33',
      });
    }
  });
}


// Helper function to format date as YYYY-MM-DD
private formatDate(date: any): string | null {
  if (!date) return null;
  // date can be Date object or string, ensure conversion
  return formatDate(date, 'yyyy-MM-dd', 'en-US');
}

private formatYear(year: any): string | null {
  if (!year) return null;
  // year can be Date object or string, ensure conversion
  return formatDate(year, 'yyyy', 'en-US');
}
  

}