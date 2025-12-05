import { Component, input, Input , OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../mat-element';
import { FormGroup } from '@angular/forms';
import { EmployeeService } from '../../../employee-service';
import { ServiceDetails, PersonalDetails, BankDetails, DependentDetails,AwardDetails,AdditionalDetails,EducationalDetails,EsmInfo} from '../../models/sainik.models';

@Component({
  selector: 'app-review-summary',
  standalone: true,
  imports: [MaterialModule,CommonModule],
  templateUrl: './review-summary.component.html',
  styleUrl: './review-summary.component.css'
})
export class ReviewSummaryComponent implements OnInit {
  @Input() personal!: PersonalDetails;
  @Input() serviceRecords: ServiceDetails[] = []; 
  @Input() bankRecords:BankDetails[]=[]; 
  @Input() dependentRecords: DependentDetails[] = [];
  @Input() awardRecords: AwardDetails[] = [];
  @Input() esmInfoRecords: EsmInfo[] = [];
  @Input() educationRecords: EducationalDetails[] = [];
  @Input() additionalDetails!: AdditionalDetails;
  @Input() awardDetails: AwardDetails[] = [];  
  @Input() esmInfoDetails: EsmInfo[] = [];


  qualificationLevels: any[] = [];
  corpsList: any[] = [];
  commissionTypes: any[] = [];
  awardCategories: any[] = [];
  awardTypes: any[] = [];
  districtList: any[] = []; 
  awardNames: any[] = [];

  constructor(private employeeService: EmployeeService) {}
  ngOnInit(): void {
      this.loadInitialData();
  }

 private loadInitialData(): void {
    this.employeeService.getEducationalLevels().subscribe(data => {
      this.qualificationLevels = data;
    });
    this.employeeService.getCorps().subscribe(data => {
      this.corpsList = data;
    });   
    this.employeeService.getCommissionTypes().subscribe(data => {
      this.commissionTypes = data;
    }); 
    this.employeeService.getAwardCategories().subscribe(data => {
      this.awardCategories = data;
    });
    this.employeeService.getAwardTypes().subscribe(data => {
      this.awardTypes = data;
    });
    this.employeeService.getDistricts().subscribe(data => {
      this.districtList = data;
    }); 
    this.employeeService.get_awards().subscribe(data => {
      this.awardNames = data;
    });
  }

  isAwardCategory(categoryId: number): boolean {
  const category = this.awardCategories.find(c => c.id === categoryId);
  return category?.name?.toLowerCase() === 'award';
}

getQualificationLevelName(id: any): string {
  const type = this.qualificationLevels.find(t => t.id === id);
  return type ? type.name : '';
}
getCorpsName(id: any): string {
  const type = this.corpsList.find(t => t.id === id);
  return type ? type.name : '';
}
getCommissionName(id: any): string {
  const type = this.commissionTypes.find(t => t.id === id);
  return type ? type.name : '';
}
 getAwardCategoryName(id: any): string {
    const category = this.awardCategories.find(c => c.id === id);
    return category ? category.name : '';
  }
  getAwardTypeName(id: any): string {
    const type = this.awardTypes.find(t => t.id === id);
    return type ? type.name : '';
  }
isNumber(value: any): value is number {
  return typeof value === 'number';
}
shouldShowAwardName(categoryId: number | null, awardName: number | null): boolean {
  // Don't show if no award name
  if (awardName === null) return false;
  
  // Don't show if no category
  if (categoryId === null) return false;
  
  // Find the category
  const category = this.awardCategories.find(c => c.id === categoryId);
  if (!category) return false;
  
  // Show award name only for "award" category, not for "certificate" or "others"
  return category.name.toLowerCase() === 'award';
}
shouldShowCertificateName(categoryId: number | null, certificateName: string | null): boolean {
  if (!certificateName) return false;
  if (!categoryId) return false;

  const category = this.awardCategories.find(c => c.id === categoryId);
  if (!category) return false;

  return category.name.toLowerCase() === 'certificate';
}

getAwardName(id: number | null): string {
  if (id === null) return '';
  const awardName = this.awardNames.find(t => t.id === id);
  return awardName ? awardName.name : ''; // Adjust based on your awardNames structure
}
  getDistrictName(id: any): string {
    const type = this.districtList.find(t => t.id === id);
    return type ? type.name : '';
  }

}
