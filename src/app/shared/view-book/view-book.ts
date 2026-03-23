import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { CommonService } from '../shared_service/common.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { MaterialModule } from '../../mat-element';
import { NgZone } from '@angular/core';

declare var Razorpay: any;

@Component({
  selector: 'app-view-book',
  imports: [CommonModule,FormsModule,MaterialModule],
  templateUrl: './view-book.html',
  styleUrls: ['./view-book.css']
})
export class ViewBook implements OnInit {

  book: any;
  quantity = 1;
  showCheckoutForm = false;
  states: any[] = [];
  apiError: string = '';
  showLoginLink = false;
  paymentSuccessMessage: string = '';
  // Inside your export class ...
  activeTab: string = 'book'; 
  form = {
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    password: '',
    address_line_1: '',
    address_line_2: '',
    landmark: '',
    city: '',
    pincode: '',
    state: ''
  };

  constructor(
    private route: ActivatedRoute,
    private commonService: CommonService,
    private ngZone: NgZone,
     private router: Router

  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) this.loadBook(id);
    this.loadStates();
  }

  loadBook(id: number) {
    this.commonService.getBookById(id).subscribe(res => this.book = res);
  }

  loadStates() {
    this.commonService.getStates().subscribe(res => this.states = res);
  }

 increaseQty() {
  if (this.quantity < this.book.stock_quantity) {
    this.quantity++;
  }

}

decreaseQty() {
  if (this.quantity > 1) {
    this.quantity--;
  }
}

openCheckoutForm() {
  if (this.book.stock_quantity === 0) {
    alert('This book is currently out of stock.');
    return;
  }

  this.showCheckoutForm = true;

  // optional smooth scroll
  setTimeout(() => {
    document.querySelector('.checkout-section')?.scrollIntoView({
      behavior: 'smooth'
    });
  }, 100);
}

 closeCheckoutForm() {
  this.showCheckoutForm = false;

  this.form = {
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    password: '',
    address_line_1: '',
    address_line_2: '',
    landmark: '',
    city: '',
    pincode: '',
    state: ''
  };
}

  // 🔥 MAIN FLOW: REGISTER → ORDER → PAY
  registerAndPay() {

  this.apiError = ''; // clear previous error

  const payload = {
    ...this.form,
    state: Number(this.form.state),
    items: [
      {
        book_id: this.book.id,
        quantity: this.quantity
      }
    ]
  };

  this.commonService.checkoutAndRegister(payload).subscribe({
    next: (res: any) => {

      localStorage.setItem('access_token', res.access_token);
      localStorage.setItem('refresh_token', res.refresh_token);

      const orderId = res.order_id;

      this.commonService.createPaymentGuest(orderId, res.access_token).subscribe({
        next: (payRes: any) => {
          this.openRazorpay(payRes, orderId, res.access_token);
        },
        error: () => {
          this.apiError = 'Payment initiation failed. Please try again.';
        }
      });
    },

    error: (err) => {
      const message = err?.error?.error;

      if (message === 'Email already registered. Please login.') {
        this.apiError = message;
        this.showLoginLink = true;

      } 
      else if (message === 'Phone number already registered. Please login.') {
        this.apiError = message;
        this.showLoginLink = true;

      } 
      else {
        this.apiError = 'Checkout failed. Please try again.';
      }
    }
  });
}

  openRazorpay(paymentRes: any, orderId: number,token: string) {

    const options = {
      key: paymentRes.razorpay_key,
      amount: paymentRes.amount,
      currency: paymentRes.currency,
      name: 'BookStore',
      description: 'Book Purchase',
      order_id: paymentRes.razorpay_order_id,
      handler: (response: any) => {
        this.verifyPayment(response, token);
      },
      theme: { color: '#3399cc' }
    };

    const rzp = new Razorpay(options);

    rzp.on('payment.failed', (res: any) => {
      alert(res.error.description);
    });

    rzp.open();
  }
verifyPayment(response: any, token: string) {
  this.commonService.verifyPaymentGuest({
    razorpay_order_id: response.razorpay_order_id,
    razorpay_payment_id: response.razorpay_payment_id,
    razorpay_signature: response.razorpay_signature
  }, token).subscribe({
    next: () => {
      // Run inside NgZone to ensure Angular detects the changes
      this.ngZone.run(() => {

        // Show success message briefly
        this.paymentSuccessMessage = '✅ Order Successful!';
        this.router.navigate([`/`]);

        // Close the checkout form
        this.showCheckoutForm = false;

        // Reset the form fields
        this.form = {
          first_name: '',
          last_name: '',
          email: '',
          phone_number: '',
          password: '',
          address_line_1: '',
          address_line_2: '',
          landmark: '',
          city: '',
          pincode: '',
          state: ''
        };

        // Clear success message after 2–3 seconds
        setTimeout(() => {
          this.paymentSuccessMessage = '';
        }, 3000);

      });
    },
    error: () => alert('Payment verification failed')
  });
}

}
