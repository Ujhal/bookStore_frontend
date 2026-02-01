import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../employee-service';
import { MaterialModule } from '../../mat-element';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-detail',
  imports:[MaterialModule, CommonModule],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.css'
})
export class OrderDetail implements OnInit{
   orderId!: number;
    order: any;
  
    constructor(
      private route: ActivatedRoute,
      private employeeService: EmployeeService
    ) {}
  
 ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadOrder();
  }

  loadOrder() {
    this.employeeService.getOrderById(this.orderId).subscribe({
      next: (data) => {
        this.order = data;
      },
      error: (err) => console.error('Error loading order:', err)
    });
  }
}
