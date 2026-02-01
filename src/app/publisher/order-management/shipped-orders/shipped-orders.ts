import { Component, OnInit } from '@angular/core';
import { PublisherService } from '../../publisher.service';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../mat-element';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-shipped-orders',
  imports: [MaterialModule, CommonModule],
  templateUrl: './shipped-orders.html',
  styleUrl: './shipped-orders.css'
})
export class ShippedOrders implements OnInit {
  orders: any[] = [];
displayedColumns: string[] = [
  'sl_no',
  'order_id',
  'suborder_id',
  'transaction_id',
  'total_amount',
  'status',
  'order_date',
  'actions'
];
  constructor(private publisherService: PublisherService, private router: Router) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    const status = 'Shipped'; // Filter only confirmed orders
    this.publisherService.getSubOrderByStatus(status).subscribe({
      next: (data) => (this.orders = data),
      error: (err) => console.error('Error loading orders:', err)
    });
  }

  onEdit(order: any): void {
    this.router.navigate(['/publisher/orders', order.suborder_id]);
  }
}
