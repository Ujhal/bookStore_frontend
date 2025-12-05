import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from '../admin-service';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { MaterialModule } from '../../mat-element';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders implements OnInit {
  orders: any[] = [];
  displayedColumns: string[] = ['id', 'transaction_id', 'total_amount', 'status', 'order_date', 'actions'];

  dataSource = new MatTableDataSource<any>(this.orders);

  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  ngAfterViewInit(): void {
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  loadOrders(): void {
    this.adminService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.dataSource.data = this.orders;
        this.dataSource._updateChangeSubscription(); // Ensure the table gets updated
      },
      error: (err) => console.error('Error loading orders:', err)
    });
  }

  onEdit(order: any): void {
    this.router.navigate(['/admin/orders', order.id]);
  }
}
