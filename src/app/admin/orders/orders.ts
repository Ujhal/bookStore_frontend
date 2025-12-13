import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from '../admin-service';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { MaterialModule } from '../../mat-element';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders implements OnInit {
  orders: any[] = [];
  displayedColumns: string[] = ['sl_no','id', 'transaction_id', 'total_amount', 'status', 'order_date', 'actions'];

  dataSource = new MatTableDataSource<any>(this.orders);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  currentPage = 1;
  totalItems = 0;

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  loadOrders(): void {
    this.adminService.getAllOrders(this.currentPage).subscribe({
      next: (response) => {
        this.orders = response.results;
        this.dataSource.data = this.orders;
        this.totalItems = response.count;
      },
      error: (err) => console.error('Error loading orders:', err)
    });
  }

  pageChanged(event: any) {
    this.currentPage = event.pageIndex + 1; // paginator is 0-indexed
    this.loadOrders();
  }

  onEdit(order: any): void {
    this.router.navigate(['/admin/orders', order.id]);
  }
}
