import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../admin-service';
import { MaterialModule} from '../../../mat-element';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-details',
  imports: [MaterialModule,CommonModule,FormsModule],
  templateUrl: './order-details.html',
  styleUrl: './order-details.css'
})
export class OrderDetails implements OnInit {

  orderId!: number;
  order: any;
  statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

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
      next: (data) => this.order = data,
      error: (err) => console.error('Error loading order:', err)
    });
  }

updateStatus() {
  // Prepare payload
  const payload: any = { status: this.order.status };

  // If shipped, include tracking number
  if (this.order.status === 'Shipped') {
    if (!this.order.tracking_number) {
      Swal.fire('Error', 'Please enter a tracking number before shipping.', 'error');
      return;
    }
    payload.tracking_number = this.order.tracking_number;
  }

  // Include remarks if present
  if (this.order.remarks) {
    payload.remarks = this.order.remarks;
  }

  Swal.fire({
    title: 'Update Order Status?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Update',
  }).then(result => {
    if (result.isConfirmed) {
      this.adminService.updateOrderStatus(this.orderId, payload)
      .subscribe({
        next: (res: any) => {
          // res should include counts of admin items and forwarded items from backend
          Swal.fire('Updated!', `Order updated. Admin items: ${res.admin_items_count}, Forwarded: ${res.forwarded_items_count}`, 'success');
          this.loadOrder();
        },
        error: (err) => Swal.fire('Error', 'Failed to update status.', 'error')
      });

    }
  });
}


}