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
  displayedColumns: string[] = ['sl_no','id', 'transaction_id', 'total_amount', 'status', 'order_date', 'actions'];
 currentPage = 1;
  totalItems = 0;
  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
  const status = 'Cancelled';

  this.adminService.getOrderByStatus(status, this.currentPage).subscribe({
    next: (res) => {
      this.orders = res.results;     // ✅ actual data
      this.totalItems = res.count;   // ✅ paginator length
    },
    error: (err) => console.error('Error loading orders:', err)
  });
}
pageChanged(event: any) {
  this.currentPage = event.pageIndex + 1; // paginator is 0-based
  this.loadOrders();
}


  onEdit(order: any): void {
    this.router.navigate(['/admin/orders', order.id]);
  }
}
