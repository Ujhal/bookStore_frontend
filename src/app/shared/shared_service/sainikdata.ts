export interface BackendSainikData {
  id_ic: string;
  created_by: number;
  service_details: ServiceDetails[];
  bank_details: BankDetails[];
  dependents: DependentDetails[];
  education_details: EducationDetails[];
  additional_details: AdditionalDetails;
  esm_info: EsmInfo[];
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  date_of_birth: string | Date;
  district_name?: number | null;
  address: string;
  address_line_2: string;
  village: string;  
  post_office: string;
  pin_code: string;
  phone_number: string;
  email: string;
  aadhar_number: string;
  is_alive: boolean;
  sainik_photo?: string | null; // Assuming sainik_photo is a URL or base64 encoded image
  expiry_date?: string | Date | null;
  awards?: AwardDetails[];
}

export interface ServiceDetails {
  corps_name: number | null;  
  commission_name: number | null;  
  description: string;
  start_date: string | Date;
  end_date: string | Date;
  unit:string;
  ppo_number: string;
  ppo_image:string | null;
}
export interface BankDetails{
    branch_name:string;
    account_number: string;
    pan_number:   string;
    bank_name: string;
    ifsc_code: string;
    account_type: string;

}

export interface DependentDetails {
  first_name: string;
  last_name: string;
  relation: string;
}
export interface EducationDetails {
  qualificationLevel_name: string;
  qualification: string;
  remarks: string;
  yearOfPassing: string,
  institution: string,
  marks: string
}

export interface AdditionalDetails {
  canteen_smart_card: boolean;
  coi: boolean;
  resident_certificate: boolean;
  echs: boolean;


}

export interface EsmInfo {
  esm_number: string;
  esm_issue_date?: string;
  esm_place_of_issue_name: number | null;
  issue_number: string | null;
}

export interface AwardDetails {
  category_name: string;
  award_type_name: string ;
  award_image?: string | null;
  received_date?: string;
  remarks?: string;
  award_name_display:string;
  certificate_name:string;
}