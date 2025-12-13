import { Component, OnInit } from '@angular/core';
import { PublisherService } from '../../publisher.service';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../mat-element';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-pending-orders',
  imports: [MaterialModule, CommonModule],
  templateUrl: './pending-orders.html',
  styleUrl: './pending-orders.css'
})
export class PendingOrders implements OnInit {
  orders: any[] = [];
  displayedColumns: string[] = ['sl_no','id', 'transaction_id', 'status', 'order_date', 'actions'];

  constructor(private publisherService: PublisherService, private router: Router) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    const status = 'Pending'; // Filter only pending orders
    this.publisherService.getSubOrderByStatus(status).subscribe({
      next: (data) => (this.orders = data),
      error: (err) => console.error('Error loading orders:', err)
    });
  }

  onEdit(order: any): void {
    this.router.navigate(['/publisher/orders', order.id]);
  }
}
