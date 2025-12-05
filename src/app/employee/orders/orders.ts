import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../mat-element';import { CommonService } from '../../shared/shared_service/common.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders implements OnInit{
  orders: any[] = [];
  selectedOrder: any | null = null;

  constructor(private commonService: CommonService) {}

  ngOnInit(): void {
    this.loadMyOrders();
  }

  loadMyOrders(): void {
    this.commonService.getmyOrders().subscribe({
      next: (data) => {
        this.orders = data;
        console.log(this.orders, 'orders loaded'); // ✅ moved inside next
      },
      error: (err) => console.error('Error loading orders:', err)
    });
  }
   viewOrderDetails(order: any): void {
    this.selectedOrder = order;
  }

  closeOrderDetails(): void {
    this.selectedOrder = null;
  }
}
