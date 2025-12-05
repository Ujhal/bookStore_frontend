import { Component, Input, OnInit, Output, EventEmitter,ViewChild,ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../mat-element';
import { EmployeeService } from '../../../employee-service'
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-service-details',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './service-details.component.html',
  styleUrl: './service-details.component.css'
})
export class ServiceDetailsComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() serviceRecords: any[] = [];
  @ViewChild('ppoFileInput') ppoFileInput!: ElementRef;
  @Output() addRecord = new EventEmitter<void>();
  @Output() recordAdded = new EventEmitter<void>();
 dataSource = new MatTableDataSource(this.serviceRecords);
  corpsList: any[] = [];
  commissionTypes: any[] = [];
  selectedPpoFileName = '';
  maxFileSizeMB = 5; // Maximum allowed file size in MB
  displayedColumns: string[] = ['corps', 'commission', 'service_date', 'actions'];
  editingIndex: number | null = null;
  allowedFileTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  constructor(private employeeService: EmployeeService) {}
   today: Date = new Date();	


  ngOnInit(): void {
    this.loadCorps();
    this.loadCommissionTypes();
  }

  loadCorps(): void {
    this.employeeService.getCorps().subscribe(data => {
      this.corpsList = data;
    });
  }

  loadCommissionTypes(): void {
    this.employeeService.getCommissionTypes().subscribe(data => {
      this.commissionTypes = data;
    });
  }

add() {
  if (this.formGroup.valid) {
    const newRecord = this.formGroup.value;

    if (this.editingIndex !== null) {
      // Update existing record
      this.serviceRecords[this.editingIndex] = newRecord;
      this.editingIndex = null;
    } else {
      // Add new record
      this.serviceRecords.push(newRecord);
    }

    this.dataSource.data = [...this.serviceRecords]; // Refresh table
    this.recordAdded.emit();
    this.clearForm();
  }
}

clearForm() {
  this.formGroup.reset();
  this.selectedPpoFileName = '';
  this.editingIndex = null;
  if (this.ppoFileInput) {
    this.ppoFileInput.nativeElement.value = '';
  }
}




deleteRecord(index: number): void {
    this.serviceRecords.splice(index, 1);
   this.dataSource.data = [...this.serviceRecords];
  }
getCorpsName(id: any): string {
  const type = this.corpsList.find(t => t.id === id);
  return type ? type.name : '';
}
getCommissionName(id: any): string {
  const type = this.commissionTypes.find(t => t.id === id);
  return type ? type.name : '';
}
editRecord(index: number): void {
  const record = this.serviceRecords[index];
  this.selectedPpoFileName = '';

  if (record.ppo_image) {
    this.selectedPpoFileName = 'Existing file'; // or the filename if you saved it
    this.formGroup.patchValue({
      ppo_image: record.ppo_image
    });
  } else {
    this.formGroup.patchValue({ ppo_image: null });
  }

  this.formGroup.patchValue({
    corps: record.corps,
    commission: record.commission,
    description: record.description,
    start_date: record.start_date,
    end_date: record.end_date,
    unit: record.unit,
    ppo_number: record.ppo_number,  // you missed this too
  });

  this.editingIndex = index;
}


  onPpoFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];

      // Validate file size
      if (file.size > this.maxFileSizeMB * 1024 * 1024) {
        alert(`File size exceeds ${this.maxFileSizeMB}MB limit`);
        this.clearPpoFileInput();
        return;
      }

      // Validate file type
      if (!this.allowedFileTypes.includes(file.type)) {
        alert('Only JPEG, PNG, or PDF files are allowed');
        this.clearPpoFileInput();
        return;
      }

      this.selectedPpoFileName = file.name;

      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        this.formGroup.patchValue({
          ppo_image: base64String
        });
      };
      reader.onerror = () => {
        console.error('Error reading file');
        this.clearPpoFileInput();
      };
      reader.readAsDataURL(file);
    }
  }

  clearPpoFileInput(): void {
    this.selectedPpoFileName = '';
    this.formGroup.patchValue({ ppo_image: null });
    if (this.ppoFileInput) {
      this.ppoFileInput.nativeElement.value = '';
    }
  }

  triggerPpoFileInput(): void {
    if (this.ppoFileInput) {
      this.ppoFileInput.nativeElement.click();
    }
  }


}
