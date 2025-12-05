import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../mat-element';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeService } from '../../../employee-service';

@Component({
  selector: 'app-bank-details',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.css']
})
export class BankDetailsComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() bankRecords: any[] = [];
  @Output() recordAdded = new EventEmitter<void>();
  
  dataSource = new MatTableDataSource(this.bankRecords);

  constructor(private employeeService: EmployeeService) {}

  accountTypes: string[] = ['Single','Joint'];
  

  displayedColumns: string[] = ['bank_name', 'branch_name', 'account_number', 'ifsc_code', 'actions'];
  editingIndex: number | null = null;

  bankList: any[] = [];
  branchList: any[] = [];
  ifsc_code: string = '';  // Dynamically populated IFSC code

  ngOnInit(): void {
    this.loadBanks();
  }

  loadBanks(): void {
    this.employeeService.getbanks().subscribe(data => {
      this.bankList = data;
    });
  }

  // Fetch branches for the selected bank
  onBankChange(bankName: string): void {
    const selectedBank = this.bankList.find(bank => bank.name === bankName);
    if (selectedBank) {
      this.branchList = selectedBank.branches;  // Set the branches for the selected bank
      this.ifsc_code = '';  // Reset IFSC code when bank is changed
      this.formGroup.patchValue({ branch_name: '', ifsc_code: '' });  // Reset the branch and IFSC field
    }
  }

  // Set IFSC code when a branch is selected
  onBranchChange(branchName: string): void {
    const selectedBranch = this.branchList.find(branch => branch.branch_name === branchName);
    if (selectedBranch) {
      this.ifsc_code = selectedBranch.ifsc_code;  // Set the IFSC code for the selected branch
      this.formGroup.patchValue({ ifsc_code: this.ifsc_code });
    }
  }

  addBankRecord(): void {
    if (this.formGroup.valid) {
      const record = this.formGroup.value;

      if (this.editingIndex !== null) {
        // Update existing record
        this.bankRecords[this.editingIndex] = record;
        this.editingIndex = null;
      } else {
        // Add new record
        this.bankRecords.push(record);
      }

      this.recordAdded.emit();
      this.dataSource.data = [...this.bankRecords]; // Refresh table
      this.clearForm();
    }
  }

  clearForm(): void {
    this.formGroup.reset();
    this.formGroup.markAsPristine();
    this.formGroup.markAsUntouched();
   
    this.editingIndex = null;

   
  }

  deleteBankRecord(index: number): void {
    this.bankRecords.splice(index, 1);
    this.dataSource.data = [...this.bankRecords]; // Refresh table
  }




  editBankRecord(index: number): void {
    const record = this.bankRecords[index];
    this.formGroup.patchValue(record);
   

    this.editingIndex = index;
  }
}
