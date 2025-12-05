import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../mat-element';
import { EmployeeService } from '../../../employee-service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { provideNativeDateAdapter } from '@angular/material/core';
@Component({
  selector: 'app-education-details',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './education-details.component.html',
  styleUrls: ['./education-details.component.css']
})
export class EducationDetailsComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() educationRecords: any[] = [];

  @Output() addRecord = new EventEmitter<void>();
  @Output() recordAdded = new EventEmitter<void>();

  dataSource = new MatTableDataSource(this.educationRecords);
  editingIndex: number | null = null;

  displayedColumns: string[] = [
    'qualificationLevel',
    'institution',
    'yearOfPassing',
    'marks',
    'actions'
  ];

  qualificationLevels: any[] = [];
  class12Streams: any[] = [];
  undergraduateDegrees: any[] = [];
  postgraduateDegrees: any[] = [];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private cdRef: ChangeDetectorRef
  ) {}
 today: Date = new Date();	

  ngOnInit(): void {
    this.initializeForm();
    this.loadInitialData();
  }

  private loadInitialData(): void {
    forkJoin({
      levels: this.employeeService.getEducationalLevels(),
      streams: this.employeeService.getclass12Streams(),
      ugList: this.employeeService.getundergraduatedegrees(),
      pgList: this.employeeService.getpostgraduatedegrees()
    }).subscribe({
      next: res => {
        this.qualificationLevels = res.levels;
        this.class12Streams = res.streams;
        this.undergraduateDegrees = res.ugList;
        this.postgraduateDegrees = res.pgList;
        this.cdRef.detectChanges();
      },
      error: err => console.error('Error loading education data', err)
    });
  }

  private initializeForm(): void {
    // Add controls if not already added
    const fields = ['institution', 'yearOfPassing', 'marks'];
    fields.forEach(field => {
      if (!this.formGroup.get(field)) {
        this.formGroup.addControl(field, this.fb.control('', Validators.required));
      }
    });

    this.formGroup.get('qualificationLevel')?.valueChanges.subscribe(level => {
      const qualificationControl = this.formGroup.get('qualification');

      qualificationControl?.reset();
      if (level >= 3 && level <= 5) {
        qualificationControl?.setValidators(Validators.required);
      } else {
        qualificationControl?.clearValidators();
      }
      qualificationControl?.updateValueAndValidity();
    });
  }

  add() {
    if (this.formGroup.valid) {
      const newRecord = this.formGroup.value;

      if (this.editingIndex !== null) {
        this.educationRecords[this.editingIndex] = newRecord;
        this.editingIndex = null;
      } else {
        this.educationRecords.push(newRecord);
      }

      this.dataSource.data = [...this.educationRecords]; // Refresh the table
      this.recordAdded.emit();
      this.clearForm();
    }
  }

  editRecord(index: number): void {
    const record = this.educationRecords[index];
    this.formGroup.patchValue({
      qualificationLevel: record.qualificationLevel,
      qualification: record.qualification,
      remarks: record.remarks,
      institution: record.institution,
      yearOfPassing: new Date(record.yearOfPassing),
      marks: record.marks
    });
    this.editingIndex = index;
  }

  deleteRecord(index: number): void {
    this.educationRecords.splice(index, 1);
    this.dataSource.data = [...this.educationRecords];
  }

  clearForm() {
    this.formGroup.reset();
    this.formGroup.markAsPristine();
    this.formGroup.markAsUntouched();
  }

  chosenYearHandler(normalizedYear: Date, datepicker: any) {
    const ctrl = this.formGroup.get('yearOfPassing');
    if (ctrl) {
      ctrl.setValue(new Date(normalizedYear.getFullYear(), 0, 1));
      datepicker.close();
    }
  }

  getQualificationLevelName(id: number): string {
    const type = this.qualificationLevels.find(t => t.id === id);
    return type ? type.name : '';
  }
}