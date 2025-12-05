import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../admin-service';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../mat-element';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pending-orders',
  imports: [MaterialModule, CommonModule],
  templateUrl: './pending-orders.html',
  styleUrls: ['./pending-orders.css']
})
export class PendingOrders implements OnInit {
  orders: any[] = [];
  displayedColumns: string[] = ['id', 'transaction_id', 'total_amount', 'status', 'order_date', 'actions'];

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    const status = 'Pending'; // Filter only pending orders
    this.adminService.getOrderByStatus(status).subscribe({
      next: (data) => (this.orders = data),
      error: (err) => console.error('Error loading orders:', err)
    });
  }

  onEdit(order: any): void {
    this.router.navigate(['/admin/orders', order.id]);
  }
}
