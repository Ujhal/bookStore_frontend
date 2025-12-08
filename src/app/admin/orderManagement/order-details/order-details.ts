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

  forwardedCount = 0;

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
        this.forwardedCount = data.order_items.filter((i: any) => i.forwarded).length;
      },
      error: (err) => console.error('Error loading order:', err)
    });
  }

  // ----------------------------------------
  // FORWARD ORDER
  // ----------------------------------------
  forwardOrder() {

    Swal.fire({
      title: 'Forward Order?',
      text: 'Once forwarded, publishers will handle their items.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Forward'
    }).then(r => {
      if (!r.isConfirmed) return;

      this.adminService.forwardOrderToPublisher(this.orderId).subscribe({
        next: () => {
          Swal.fire('Success', 'Order forwarded to publishers.', 'success');
          this.loadOrder();
        },
        error: () => Swal.fire('Error', 'Failed to forward order.', 'error')
      });
    });
  }

  // ----------------------------------------
  // UPDATE ITEM STATUS (admin only)
  // ----------------------------------------
  updateItemStatus(item: any) {
    const payload: any = { status: item.status };

    if (item.status === 'Shipped' && !item.tracking_number) {
      Swal.fire('Error', 'Tracking number required', 'error');
      return;
    }

    if (item.tracking_number) payload.tracking_number = item.tracking_number;

    this.adminService.updateOrderItemStatus(item.id, payload).subscribe({
      next: () => Swal.fire('Updated', 'Item updated successfully', 'success'),
      error: () => Swal.fire('Error', 'Failed to update item', 'error')
    });
  }

}