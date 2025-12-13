import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../admin-service';
import { MaterialModule } from '../../../mat-element';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-details',
  imports: [MaterialModule, CommonModule],
  templateUrl: './order-details.html',
  styleUrl: './order-details.css'
})
export class OrderDetails implements OnInit {

  orderId!: number;
  order: any;

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadOrder();
  }

  loadOrder() {
    this.adminService.getOrderById(this.orderId).subscribe({
      next: (data) => {
        this.order = data;
      },
      error: (err) => console.error('Error loading order:', err)
    });
  }

}
