import {
  Input,
  AfterViewInit,
  ViewChild,
  Component,
  OnInit,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { MaterialModule } from '../../mat-element';
import { BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component';
import { SainikFormData } from '../../employee/sainik-form/models/sainik.models';
import { ApplicationViewComponent } from '../../shared/application-view/application-view.component';
import { CommonModule } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface BaseRow {
  serial_no: number;
  id_ic: any;
  description: any;
  name: any;
  unit: any;
  doe: string;
  dor: string;
  district_name: any;
  corps: any;
  aadhar_number: any;
  email: any;
  phone_number: any;
  is_alive: any;
  ppo_number: any;
  bank_account_number: any;
  bank_ifsc: any;
  bank_name: any;
  canteen_smart_card: any;
  coi: any;
  resident_certificate: any;
  echs: any;
  dependents_count: any;
  awards_count: any;

  [key: string]: any;  // << This line makes it indexable by string keys!
}


@Component({
  selector: 'app-shared-table-report',
  standalone: true,
  imports: [  
    RouterModule,
    MaterialModule,FormsModule,
    CommonModule,
  ],
  templateUrl: './shared-table-report.component.html',
  styleUrl: './shared-table-report.component.css'
})
export class SharedTableReportComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['sl_no','id_ic','rank', 'name','unit','doe','dor','district'];
  dataSource = new MatTableDataSource<any>([]);
  selectedSainikDetails: SainikFormData | null = null;
  

 availableColumns = [
  { header: 'Sl. No', dataKey: 'serial_no', selected: true },
  { header: 'Personal Number', dataKey: 'id_ic', selected: true },
  { header: 'Rank', dataKey: 'description', selected: true },
  { header: 'Name', dataKey: 'name', selected: true },
  { header: 'Unit', dataKey: 'unit', selected: true },
  { header: 'Date Of Enrollment', dataKey: 'doe', selected: true },
  { header: 'Date Of Retirement', dataKey: 'dor', selected: true },
  { header: 'District', dataKey: 'district_name', selected: true },
  // New fields only for report
  { header: 'Aadhar Number', dataKey: 'aadhar_number', selected: false },
  { header: 'Email', dataKey: 'email', selected: false },
  { header: 'Phone Number', dataKey: 'phone_number', selected: false },
  { header: 'Is Alive', dataKey: 'is_alive', selected: false },
  { header: 'Corps', dataKey: 'corps', selected: false },
  { header: 'PPO Number', dataKey: 'ppo_number', selected: false },
  { header: 'Bank Account Number', dataKey: 'bank_account_number', selected: false },
  { header: 'Bank IFSC', dataKey: 'bank_ifsc', selected: false },
  { header: 'Bank Name', dataKey: 'bank_name', selected: false },
  { header: 'Canteen Smart Card', dataKey: 'canteen_smart_card', selected: false },
  { header: 'COI', dataKey: 'coi', selected: false },
  { header: 'Resident Certificate', dataKey: 'resident_certificate', selected: false },
  { header: 'ECHS', dataKey: 'echs', selected: false },
  { header: 'Dependents (Count)', dataKey: 'dependents_count', selected: false },
  { header: 'Dependents (Details)', dataKey: 'dependent_details', selected: false },  // New!
  { header: 'Awards/Certificate (Count)', dataKey: 'awards_count', selected: false },
  { header: 'Awards/Certificate (Details)', dataKey: 'award_details', selected: false }, 
];


  private _sainikData: any[] = [];

  @Input()
  set sainikData(value: any[]) {
  this._sainikData = value || [];
  this.dataSource.data = this._sainikData;
}


  get sainikData(): any[] {
    return this._sainikData;
  }

@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    // No default data fetch here
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Enable custom sorting for name and dates
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'doe':
          return new Date(item.start_date);
        case 'dor':
          return new Date(item.end_date);
        default:
          return item[property];
      }
    };
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

/*generatePDF() {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.text('Sainik List Report', 14, 22);

  // Filter columns based on user selection
  const columns = this.availableColumns.filter(col => col.selected);

  // Prepare rows from filtered data
 const rows: PdfRow[] = this.dataSource.filteredData.map((item, index) => {
  const baseRow = {
    serial_no: index + 1,
    id_ic: item.id_ic,
    description: item.description,
    name: item.name,
    unit: item.unit,
    doe: item.start_date ? new Date(item.start_date).toLocaleDateString() : '',
    dor: item.end_date ? new Date(item.end_date).toLocaleDateString() : '',
    district_name: item.district_name,
    corps: item.corps,
  };

  const filteredRow: any = {};
  columns.forEach(col => {
    filteredRow[col.dataKey] = (baseRow as any)[col.dataKey];
  });

  return filteredRow;
});


  autoTable(doc, {
    head: [columns.map(col => col.header)],
    body: rows.map(row => columns.map(col => row[col.dataKey])),
    startY: 30,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [22, 160, 133] },
  });

  doc.save('sainik-list-report.pdf');
}*/
exportToExcel() {
  // Get selected columns
  const columns = this.availableColumns.filter(col => col.selected);

  // Prepare data rows from filtered data
  const dataToExport = this.dataSource.filteredData.map((item, index) => {
    // Build a summary string for dependents
    const dependentDetails = item.dependents && item.dependents.length
      ? item.dependents.map((dep: any) => 
          `${dep.name} (${dep.relation})`
        ).join('; ')
      : '';

    // Build a summary string for awards
    const awardDetails = item.awards && item.awards.length
      ? item.awards.map((award: any) =>
          `${award.award_type || ''}, ${award.category || ''}, ${award.award_name || ''} (${award.received_date ? new Date(award.received_date).toLocaleDateString() : ''})`.trim()
        ).join('; ')
      : '';

    const baseRow: { [key: string]: any } = {
      serial_no: index + 1,
      id_ic: item.id_ic,
      description: item.description,
      name: item.name,
      unit: item.unit,
      doe: item.start_date ? new Date(item.start_date).toLocaleDateString() : '',
      dor: item.end_date ? new Date(item.end_date).toLocaleDateString() : '',
      district_name: item.district_name,
      corps: item.corps,
      aadhar_number: item.aadhar_number,
      email: item.email,
      phone_number: item.phone_number,
      is_alive: item.is_alive,
      ppo_number: item.ppo_number,
      bank_account_number: item.bank_account_number,
      bank_ifsc: item.bank_ifsc,
      bank_name: item.bank_name,
      canteen_smart_card: item.canteen_smart_card,
      coi: item.coi,
      resident_certificate: item.resident_certificate,
      echs: item.echs,
      dependents_count: item.dependents ? item.dependents.length : 0,
      awards_count: item.awards ? item.awards.length : 0,
      dependent_details: dependentDetails,
      award_details: awardDetails
    };

    // Only keep selected columns, add these new detail columns optionally
    const filteredRow: { [key: string]: any } = {};
    columns.forEach(col => {
      // Handle new columns you might add for details
      if (col.dataKey === 'dependent_details') {
        filteredRow[col.header] = dependentDetails;
      } else if (col.dataKey === 'award_details') {
        filteredRow[col.header] = awardDetails;
      } else {
        filteredRow[col.header] = baseRow[col.dataKey];
      }
    });

    return filteredRow;
  });

  // Create worksheet and workbook
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
  const workbook: XLSX.WorkBook = {
    Sheets: { 'Sainik List': worksheet },
    SheetNames: ['Sainik List']
  };

  // Write workbook and save file
  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(data, 'sainik-list-report.xlsx');
}




}
