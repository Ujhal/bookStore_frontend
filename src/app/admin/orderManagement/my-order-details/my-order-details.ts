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
  const address = this.subOrder.shipping_address;

  const customerName = address.name || 
    (this.subOrder.user?.first_name + ' ' + this.subOrder.user?.last_name);

  doc.setFontSize(16);
  doc.text('Shipping Address', 20, 20);

  doc.setFontSize(12);

  let y = 30;

  const addLine = (label: string, value: any) => {
    if (value !== null && value !== undefined && value !== '') {
      doc.text(`${label}: ${value}`, 20, y);
      y += 10;
    }
  };

  addLine('Name', customerName);
  addLine('Address Line 1', address.address_line_1);
  addLine('Address Line 2', address.address_line_2);
  addLine('Landmark', address.landmark);
  addLine('City', address.city);
  addLine('State', address.state_name);
  addLine('Pincode', address.pincode);
  addLine('Phone', address.phone_number);

  doc.save(`Shipping_Address_${this.subOrder.id}.pdf`);
}
}

