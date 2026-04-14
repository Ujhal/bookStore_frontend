import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../admin-service';
import { MaterialModule } from '../../../mat-element';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
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
 printShippingAddress() {
    if (!this.orderId || !this.order.shipping_address) return;

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Shipping Address', 20, 20);

    const address = this.order.shipping_address;
    const customerName = address.name || 
    (this.order.user?.first_name + ' ' + this.order.user?.last_name);
    doc.setFontSize(12);

    doc.text(`Name: ${customerName}`, 20, 30);
    doc.text(`Address Line 1: ${address.address_line_1}`, 20, 40);
    doc.text(`Address Line 2: ${address.address_line_2}`, 20, 50);
    doc.text(`Landmark: ${address.landmark}`, 20, 60);
    doc.text(`City: ${address.city}`, 20, 70);
    doc.text(`State: ${address.state_name}`, 20, 80);
    doc.text(`Pincode: ${address.pincode}`, 20, 90);
    doc.text(`Phone: ${address.phone_number}`, 20, 100);

    doc.save(`Shipping_Address_${this.order.id}.pdf`);
  }
}
