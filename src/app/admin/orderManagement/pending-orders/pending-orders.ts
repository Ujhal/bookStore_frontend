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
  displayedColumns: string[] = ['sl_no','id', 'transaction_id', 'total_amount', 'status', 'order_date', 'actions'];

  currentPage = 1;
  totalItems = 0;

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    this.loadOrders();
  }

loadOrders(): void {
  const status = 'Pending';

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
