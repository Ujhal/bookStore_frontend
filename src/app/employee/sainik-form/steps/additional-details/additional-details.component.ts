import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../mat-element';
import { EmployeeService } from '../../../employee-service';
import { provideNativeDateAdapter } from '@angular/material/core';
import { AwardDetails, EsmInfo } from '../../models/sainik.models';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-additional-details',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './additional-details.component.html',
  styleUrls: ['./additional-details.component.css']
})
export class AdditionalDetailsComponent implements OnInit {
@Input() formGroup!: FormGroup;
  @Input() awardForm!: FormGroup;
  @Input() esmInfoForm!: FormGroup;

  @Input() esmInfoRecords: EsmInfo[] = [];
  @Input() awardRecords: AwardDetails[] = [];

  @Output() addEsm = new EventEmitter<EsmInfo>();
  @Output() removeEsm = new EventEmitter<number>();

  @Output() addAward = new EventEmitter<AwardDetails>();
  @Output() removeAward = new EventEmitter<number>();

  dataSource = new MatTableDataSource<AwardDetails>(this.awardRecords);
  esmDataSource = new MatTableDataSource<EsmInfo>(this.esmInfoRecords);
  showCertificateNameInput = false;

  esmDisplayedColumns: string[] = ['esm_number', 'esm_issue_date', 'esm_place_of_issue', 'issue_number', 'actions'];
  displayedColumns: string[] = ['award/certificate', 'civil/service', 'actions'];

  qualificationList: any[] = [];
  esmIssuePlaces: any[] = [];
  awardTypes: any[] = [];
  awardCategories: any[] = [];
  awardNames: any[] = [];
  selectedFileName = '';
  filteredAwards: any[] = [];
  showAwardNameDropdown = false;

issueOptions = [
  { label: '1st Issue', value: 'first' },
  { label: '2nd Issue', value: 'second' },
  { label: '3rd Issue', value: 'third' },
  { label: '4th Issue', value: 'fourth' },
];


  constructor(private fb: FormBuilder, private employeeService: EmployeeService) {}
    today: Date = new Date();
  ngOnInit(): void {
    this.loadESMIssuePlaces();
    this.loadQualifications();
    this.loadAwardTypes();
    this.loadAwardCategories();
    this.loadAwards();

    this.awardForm.get('category')?.valueChanges.subscribe(() => {
    this.updateAwardDropdownVisibilityAndOptions();
  });

  this.awardForm.get('award_type')?.valueChanges.subscribe(() => {
    this.updateAwardDropdownVisibilityAndOptions();
  });
  }
  
updateAwardDropdownVisibilityAndOptions(): void {
  const selectedCategoryId = this.awardForm.get('category')?.value;
  const selectedTypeId = this.awardForm.get('award_type')?.value;

  const selectedCategory = this.awardCategories.find(c => c.id === selectedCategoryId);
  const selectedType = this.awardTypes.find(t => t.id === selectedTypeId);

  // Show award name dropdown only if category is "Award"
  this.showAwardNameDropdown = selectedCategory?.name?.toLowerCase() === 'award';

  this.showCertificateNameInput = selectedCategory?.name?.toLowerCase() === 'certificate';


  // Filter awards based on award_type
  if (this.showAwardNameDropdown && selectedType) {
    this.filteredAwards = this.awardNames.filter(
      award => award.award_type === selectedType.id
    );
  } else {
    this.filteredAwards = [];
  }

  // Reset award_name if dropdown is hidden
  if (!this.showAwardNameDropdown) {
    this.awardForm.get('award_name')?.reset();
  }
  if (!this.showCertificateNameInput) {
    this.awardForm.get('certificate_name')?.reset();
  }
}



  loadESMIssuePlaces() {
    this.employeeService.getEsmIssuePlaces().subscribe(data => this.esmIssuePlaces = data);
  }

  loadQualifications() {
    this.employeeService.getQualifications().subscribe(data => this.qualificationList = data);
  }

  loadAwardTypes() {
    this.employeeService.getAwardTypes().subscribe(data => this.awardTypes = data);
  }

  loadAwardCategories() {
    this.employeeService.getAwardCategories().subscribe(data => this.awardCategories = data);
  }

  loadAwards() {
    this.employeeService.get_awards().subscribe(data => this.awardNames = data);
  }

onAddAwardClick() {
  if (this.awardForm.valid) {
    const awardData: AwardDetails = this.awardForm.value;
    this.addAward.emit(awardData); // ✅ Emit to parent
    this.awardForm.reset(); // ✅ Reset form after use

    this.dataSource.data = [...this.awardRecords];

  }
}
 getEsmPlaceName(id: number | null): string {
    const place = this.esmIssuePlaces.find(p => p.id === id);
    return place ? place.name : '';
  }
  onRemoveAwardClick(index: number) {
    this.awardRecords.splice(index, 1);
    this.dataSource.data = [...this.awardRecords];
  }

  getAwardCategoryName(id: number): string {
    const category = this.awardCategories.find(c => c.id === id);
    return category ? category.name : '';
  }
  getAwardTypeName(id: number): string {
    const type = this.awardTypes.find(t => t.id === id);
    return type ? type.name : '';
  }

   getAwardName(id: number): string {
    const type = this.awardNames.find(t => t.id === id);
    return type ? type.name : '';
  }
  
onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files?.length) {
    const file = input.files[0];
    this.selectedFileName = file.name;

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      this.awardForm.patchValue({ 
        award_image: base64String  // "data:image/png;base64,iVBORw0KGg..."
      });
    };
    reader.readAsDataURL(file);
  }
}
onAddEsmClick(): void {

    if (this.esmInfoForm.valid) {
    const esmData: EsmInfo = this.esmInfoForm.value;
    this.addEsm.emit(esmData); // ✅ Emit to parent
    this.esmInfoForm.reset(); // ✅ Reset form after use

    this.esmDataSource.data = [...this.esmInfoRecords];

  }
  }

  onRemoveEsmClick(index: number): void {
    this.removeEsm.emit(index);  // Emit to parent to remove from the array
    this.esmInfoRecords.splice(index, 1);
    this.esmDataSource.data = [...this.esmInfoRecords];
  }
}