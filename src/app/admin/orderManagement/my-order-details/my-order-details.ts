import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublisherService } from '../../../publisher/publisher.service';
import { MaterialModule} from '../../../mat-element';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-my-order-details',
  imports: [MaterialModule, CommonModule,FormsModule],
  templateUrl: './my-order-details.html',
  styleUrl: './my-order-details.css'
})
export class MyOrderDetails implements OnInit {

  subOrderId!: number;
  subOrder: any;

  statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  constructor(
    private route: ActivatedRoute,
    private publisherService: PublisherService
  ) {}

  ngOnInit(): void {
    this.subOrderId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadSubOrder();
  }

  loadSubOrder() {
    this.publisherService.getSubOrderById(this.subOrderId).subscribe({
      next: (data) => this.subOrder = data,
      error: (err) => console.error('Error loading sub-order:', err)
    });
  }

  updateSubOrder() {
    if (this.subOrder.status === 'Shipped' && !this.subOrder.tracking_number) {
      Swal.fire('Error', 'Tracking number is required for shipped items', 'error');
      return;
    }

    this.publisherService.updateSubOrder(this.subOrder.id, this.subOrder).subscribe({
      next: () => Swal.fire('Success', 'Sub-order updated successfully', 'success'),
      error: () => Swal.fire('Error', 'Failed to update sub-order', 'error')
    });
  }
printShippingAddress() {
    if (!this.subOrder || !this.subOrder.shipping_address) return;

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Shipping Address', 20, 20);

    const address = this.subOrder.shipping_address;
    doc.setFontSize(12);
    doc.text(`Address Line 1: ${address.address_line_1}`, 20, 40);
    doc.text(`Address Line 2: ${address.address_line_2}`, 20, 50);
    doc.text(`Landmark: ${address.landmark}`, 20, 60);
    doc.text(`City: ${address.city}`, 20, 70);
    doc.text(`State: ${address.state_name}`, 20, 80);
    doc.text(`Pincode: ${address.pincode}`, 20, 90);
    doc.text(`Phone: ${address.phone_number}`, 20, 100);

    doc.save(`Shipping_Address_${this.subOrder.id}.pdf`);
  }
}

