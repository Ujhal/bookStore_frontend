import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublisherService } from '../../publisher.service';
import { MaterialModule} from '../../../mat-element';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-details',
  imports: [],
  templateUrl: './order-details.html',
  styleUrl: './order-details.css'
})
export class OrderDetails implements OnInit {

  orderId!: number;
  order: any;

  constructor(
    private route: ActivatedRoute,
    private publisherService: PublisherService
  ) {}
  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadOrder();
  }

  loadOrder() {
    this.publisherService.getSubOrderById(this.orderId).subscribe({
      next: (data) => {
        this.order = data;
      },
      error: (err) => console.error('Error loading order:', err)
    });
  }
}
