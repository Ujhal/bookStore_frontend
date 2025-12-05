import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../mat-element';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-dependent-details',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
   providers: [provideNativeDateAdapter()],
  templateUrl: './dependent-details.component.html',
  styleUrl: './dependent-details.component.css'
})
export class DependentDetailsComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() dependentRecords: any[] = [];

 @Output() recordAdded = new EventEmitter<void>();
  dataSource = new MatTableDataSource(this.dependentRecords);
  relations: string[] = ['Father', 'Mother', 'Wife', 'Son', 'Daughter', 'Other'];

  editingIndex: number | null = null;
displayedColumns: string[] = ['first_name', 'last_name', 'relation', 'date_of_birth', 'employment_status', 'actions'];
 today: Date = new Date();	

  ngOnInit(): void {}

 // Update the add() method to match the bank component's pattern
add() {
  if (this.formGroup.valid) {
    const record = this.formGroup.value;

    if (this.editingIndex !== null) {
      // Directly modify the array (like bank component)
      this.dependentRecords[this.editingIndex] = record;
      this.editingIndex = null;
    } else {
      // Add new record
      this.dependentRecords.push(record);
    }

    this.dataSource.data = [...this.dependentRecords]; // Refresh table
    this.recordAdded.emit(); // Simple emit like bank component
    this.clearForm();
  }
}
// Update the delete method similarly
deleteRecord(index: number): void {
  this.dependentRecords.splice(index, 1);
  this.dataSource.data = [...this.dependentRecords]; // Refresh table
  // ... rest of your delete logic ...
}

 editRecord(index: number): void {
  const record = this.dependentRecords[index];
  this.formGroup.patchValue({
    first_name: record.first_name,
    last_name: record.last_name,
    relation: record.relation,
    date_of_birth: record.date_of_birth,
    employment_status: record.employment_status
  });
  this.editingIndex = index;
}



  clearForm(): void {
    this.formGroup.reset();
    this.formGroup.markAsPristine();
    this.formGroup.markAsUntouched();
    this.editingIndex = null;
  }
}
