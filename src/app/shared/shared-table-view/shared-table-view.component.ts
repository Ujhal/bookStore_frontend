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

@Component({
  selector: 'app-shared-table-view',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    BreadcrumbComponent,
    ApplicationViewComponent,
    CommonModule,
  ],
  templateUrl: './shared-table-view.component.html',
  styleUrl: './shared-table-view.component.css',
})
export class SharedTableViewComponent implements OnInit, AfterViewInit {
//  displayedColumns: string[] = ['id_ic', 'corps', 'name', 'district','registered_at',];
  displayedColumns: string[] = ['id_ic','rank', 'name','unit','doe','dor','district','actions'];
  dataSource = new MatTableDataSource<any>([]);
  selectedSainikDetails: SainikFormData | null = null;

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

  // Enable custom sorting for name and registered_at
  this.dataSource.sortingDataAccessor = (item, property) => {
    switch (property) {
      case 'name':
        return `${item.first_name || ''} ${item.middle_name || ''} ${item.last_name || ''}`
          .trim()
          .toLowerCase();
      case 'doe':
        return new Date(item.start_date); // created_at maps to registered_at column
      case 'dor':
        return new Date(item.end_date); // created_at maps to registered_at column
      default:
        return item[property];
    }
  };
}


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  viewDetails(row: any) {
  const role = Number(localStorage.getItem('role')); // or fetch from a service

  if (role === 1) {
    this.router.navigate(['/admin/ViewSainik/view', row.id_ic], { relativeTo: this.route });
  } else if (role === 2) {
    this.router.navigate(['/manager/ViewSainik/view', row.id_ic], { relativeTo: this.route });
  } else {
    console.warn('Unknown role:', role);
  }
}
}
