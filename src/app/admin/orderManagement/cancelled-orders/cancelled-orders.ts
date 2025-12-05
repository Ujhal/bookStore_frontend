import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../admin-service';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../mat-element';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-cancelled-orders',
  imports: [MaterialModule, CommonModule],
  templateUrl: './cancelled-orders.html',
  styleUrl: './cancelled-orders.css'
})
export class CancelledOrders  implements OnInit {
  orders: any[] = [];
  displayedColumns: string[] = ['id', 'transaction_id', 'total_amount', 'status', 'order_date', 'actions'];

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    const status = 'Cancelled'; // Filter only pending orders
    this.adminService.getOrderByStatus(status).subscribe({
      next: (data) => (this.orders = data),
      error: (err) => console.error('Error loading orders:', err)
    });
  }

  onEdit(order: any): void {
    this.router.navigate(['/admin/orders', order.id]);
  }
}
