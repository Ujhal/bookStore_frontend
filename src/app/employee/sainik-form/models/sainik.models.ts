export interface SainikFormData {
  personalDetails: PersonalDetails;
  serviceDetails: ServiceDetails[]; 
  bankDetails: BankDetails[];
  dependentDetails:DependentDetails[]; 
  additionalDetails: AdditionalDetails;
  educationalDetails: EducationalDetails[]; 
  awards?: AwardDetails[];
}

export interface PersonalDetails {
  id_ic: string;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  date_of_birth: Date | string;
  district?: number | null;
  address: string;
  address_line_2: string;
  village: string;
  post_office: string;
  pin_code: string;
  phone_number: string;
  email: string;
  aadhar_number: string;
  is_alive: boolean;
  expiry_date?: Date | string | null;
  sainik_photo?: File;
}

export interface ServiceDetails {
  corps: number | null;  
  commission: number | null;  
  description: string;
  start_date: string | Date;
  end_date: string | Date;
  unit: string;
  ppo_number: string;
  ppo_image?: File;
}
export interface BankDetails{
    account_number: string;
    pan_number:   string;
    bank_name: string;
    branch_name: string;
    ifsc_code: string;
    account_type: string;
    
}

export interface DependentDetails {
  first_name: string;
  last_name: string;
  relation: string;
  date_of_birth: string| Date;
  employment_status: string;
}

export interface AdditionalDetails {
  canteen_smart_card: boolean;
  coi: boolean;
  resident_certificate: boolean;
  echs: boolean;
}
export interface EsmInfo{
  esm_number: string;
  esm_issue_date: string| Date;
  esm_place_of_issue: number | null;
  issue_number: string | null;
}

export interface AwardDetails {
  category:number | null;
  award_type: number | null;
  award_image?: File;
  received_date?: string | Date;
  remarks?: string;
  award_name:number | null; /*only name in display but going number in backend*/
  certificate_name : string | null;
}
export interface EducationalDetails {
    qualificationLevel: number | null;
    qualification: string;  
    remarks: string ;
    yearOfPassing: string,
    institution: string,
    marks: string

}