import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../mat-element';
import { EmployeeService } from '../employee-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './orders.html',
  styleUrls: ['./orders.css']
})
export class Orders implements OnInit {
  orders: any[] = [];
  selectedOrder: any | null = null;
  displayedColumns: string[] = ['serial', 'order_id', 'order_date', 'status', 'action'];

  next: string | null = null;
  previous: string | null = null;

  constructor(private employeeService: EmployeeService,private router: Router) {}

  ngOnInit(): void {
    this.loadMyOrders();
  }

  loadMyOrders(url?: string): void {
    this.employeeService.getmyOrders(url).subscribe({
      next: (data: any) => {
        this.orders = data.results;   // ✅ extract the results array
        this.next = data.next;
        this.previous = data.previous;
        console.log(this.orders, 'orders loaded');
      },
      error: (err) => console.error('Error loading orders:', err)
    });
  }

  loadPage(url: string | null): void {
    if (!url) return;
    this.loadMyOrders(url);
  }



  viewOrderDetails(order: any): void {
  this.router.navigate(['/customer/orders', order.order_id]);
}


  closeOrderDetails(): void {
    this.selectedOrder = null;
  }
}
