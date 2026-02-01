import { Component, OnInit,ViewChild} from '@angular/core';
import { AdminService } from '../../admin-service'; 
import { Router } from '@angular/router';
import { MaterialModule } from '../../../mat-element';
import { CommonModule } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-pending-orders',
  imports: [MaterialModule, CommonModule],
  templateUrl: './pending-orders.html',
  styleUrls: ['./pending-orders.css']
})
export class PendingOrders  implements OnInit {
  orders: any[] = [];
    currentPage = 1;
  totalItems = 0;
displayedColumns: string[] = [
  'sl_no',
  'order_id',
  'suborder_id',
  'transaction_id',
  'total_amount',
  'status',
  'order_date',
 
];
  dataSource = new MatTableDataSource<any>(this.orders);
  
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(private publisherService: AdminService, private router: Router) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.publisherService.getAllSubOrder(this.currentPage).subscribe({
       next: (response) => {
        this.orders = response.results;
        this.dataSource.data = this.orders;
        this.totalItems = response.count;
      },
    })
  }
 pageChanged(event: any) {
    this.currentPage = event.pageIndex + 1; // paginator is 0-indexed
    this.loadOrders();
  }
  onEdit(order: any): void {
    this.router.navigate(['/publisher/orders', order.id]);
  }
}

