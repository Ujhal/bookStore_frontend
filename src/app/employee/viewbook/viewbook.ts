import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../shared/shared_service/common.service';
import { CommonModule } from '@angular/common';
import { Address, AddAddress } from '../../shared/add-address/add-address';
import { EmployeeService } from '../../employee/employee-service';
import { Router } from '@angular/router';

declare var Razorpay: any;

@Component({
  selector: 'app-viewbook',
  imports: [CommonModule, AddAddress],
  templateUrl: './viewbook.html',
  styleUrl: './viewbook.css'
})
export class Viewbook implements OnInit {
  book: any;
  quantity = 1;

  savedAddresses: Address[] = [];
  selectedAddress?: Address;
  showAddressSelector: boolean = false;
  isAddressSelected: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private commonService: CommonService,
    private employeeService: EmployeeService,
    private router: Router

  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) this.loadBookDetails(id);

    this.loadAddresses();
  }

  loadBookDetails(id: number): void {
    this.commonService.getBookById(id).subscribe({
      next: (data) => (this.book = data),
      error: (err) => console.error(err)
    });
  }

  loadAddresses(): void {
    this.employeeService.getAddresses().subscribe({
      next: (res: any) =>
        (this.savedAddresses = res.map((a: any) => ({
          id: String(a.id),
          line1: a.address_line_1,
          line2: a.address_line_2,
          city: a.city,
          state: a.state,
          zip: a.pincode,
          phone_number: a.phone_number
        }))),
      error: (err) => console.error(err)
    });
  }

  addToCart(): void {
    if (!this.book) return alert('No book selected!');

    this.employeeService
      .addToCart({ book_id: this.book.id, quantity: this.quantity })
      .subscribe({
        next: () => alert(`${this.book.title} added to cart successfully!`),
        error: (err) => {
          console.error(err);
          alert('Failed to add book to cart.');
        }
      });
  }

  openAddressSelector() {
    if (this.savedAddresses.length) this.showAddressSelector = true;
    else alert('Please add an address to proceed!');
  }

  cancelAddressSelection() {
    this.showAddressSelector = false;
  }

  onAddressSelected(addr: Address) {
    this.selectedAddress = addr;
    this.isAddressSelected = true;
    this.showAddressSelector = false;
  }

  increaseQty(): void {
  if (this.book?.stock_quantity && this.quantity < this.book.stock_quantity) {
    this.quantity++;
  } else if (this.book?.stock_quantity && this.quantity >= this.book.stock_quantity) {
    alert(`Cannot order more than ${this.book.stock_quantity} items!`);
  }
}

decreaseQty(): void {
  if (this.quantity > 1) this.quantity--;
}

  // 🔥 NEW METHOD: Place order AND trigger Razorpay
 placeOrderAndPay(): void {
  console.log('[Order] placeOrderAndPay triggered');

  if (!this.book || !this.selectedAddress) {
    console.warn('[Order] Missing book or address', {
      book: this.book,
      address: this.selectedAddress
    });
    return alert('Please select an address!');
  }

  const payload = {
  address_id: this.selectedAddress.id,
  items: [
    {
      book_id: this.book.id,
      quantity: this.quantity
    }
  ]
};


  console.log('[Order] Payload prepared:', payload);

  // Step 1: Create Order
  this.commonService.placeOrder(payload).subscribe({
    next: (res: any) => {
      console.log('[Order] Order created successfully:', res);

      const orderId = res.order_id;
      const totalAmount = res.total_amount;

      console.log('[Order] Order ID:', orderId);
      console.log('[Order] Total Amount:', totalAmount);

      // Step 2: Create Razorpay Order
      const paymentPayload = { order_id: orderId };
      this.commonService.createPayment(orderId).subscribe({
        next: (paymentRes: any) => {
          console.log('[Payment] Razorpay order created:', paymentRes);

          const options = {
            key: paymentRes.razorpay_key,
            amount: paymentRes.amount,
            currency: paymentRes.currency,
            name: 'BookStore',
            description: 'Book Purchase',
            order_id: paymentRes.razorpay_order_id,
            prefill: {
              name: this.book?.author_name ?? 'Customer',
              email: 'customer@email.com',
              contact: '9999999999'
            },
            notes: { order_id: orderId.toString() },
            theme: { color: '#3399cc' },
            handler: (response: any) => {
              console.log('[Payment] Payment success response:', response);

              // Step 3: Verify Payment
              this.verifyPayment(response);
            }
          };

          console.log('[Payment] Razorpay options:', options);

          const rzp = new Razorpay(options);

          rzp.on('payment.failed', (response: any) => {
            console.error('[Payment] Payment failed:', response);
            alert(response.error.description);
          });

          console.log('[Payment] Opening Razorpay checkout');
          rzp.open();
        },
        error: (err) => {
          console.error('[Payment] Error creating Razorpay order:', err);
        }
      });
    },
    error: (err) => {
      console.error('[Order] Error placing order:', err);
    }
  });
}


  verifyPayment(response: any) {
  this.commonService
    .verifyPayment({
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature
    })
    .subscribe({
      next: (res: any) => {
        alert('Payment successful!');

        // Assuming your backend returns the order id
        const orderId = res.order_id || this.book?.id; 

        // Redirect to order page
        this.router.navigate([`/customer/orders/${orderId}`]);
      },
      error: () => alert('Payment verification failed!')
    });
}
}