import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../mat-element';
import { EmployeeService } from '../employee-service';
import { Router } from '@angular/router';
import { Address, AddAddress } from '../../shared/add-address/add-address';
import { CommonService } from '../../shared/shared_service/common.service'; // for placeOrder
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
declare var Razorpay: any;


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, MaterialModule, AddAddress,ReactiveFormsModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {cartItems: any[] = [];
  totalAmount: number = 0;
   book: any;
   quantity = 1;

  savedAddresses: Address[] = [];
    states: any[] = [];

  selectedAddress?: Address;
  showAddressSelector: boolean = false;  
  isAddressSelected: boolean = false;
  showQuickAddressForm: boolean = false;
  quickAddressForm!: FormGroup;
  stateMap: { [key: number]: string } = {};


  constructor(
    private employeeService: EmployeeService, 
    private commonService: CommonService,
    private router: Router,
    private fb: FormBuilder,

  ) {}

  ngOnInit(): void {
    this.loadCart();
    this.loadAddresses();
    this.initQuickForm();
    this.loadStates();

  }

  loadAddresses(): void {
    this.employeeService.getAddresses().subscribe({
      next: (res: any) => this.savedAddresses = res.map((a: any) => ({
        id: String(a.id),
        line1: a.address_line_1,
        line2: a.address_line_2,
        city: a.city,
        state: a.state,
        state_name: a.state_name ,
        zip: a.pincode,
        phone_number: a.phone_number
      })),
      error: (err) => console.error('Error loading addresses', err)
    });
  }

  loadCart(): void {
    this.employeeService.getCart().subscribe({
      next: (res) => {
        this.cartItems = res.items || [];
        this.calculateTotal();
      },
      error: (err) => console.error('Error loading cart:', err)
    });
  }

  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce(
      (sum, item) => sum + (item.book?.price || item.price) * item.quantity,
      0
    );
  }

  increaseQty(item: any): void {
    item.quantity++;
    this.updateCartItem(item);
  }

  decreaseQty(item: any): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.updateCartItem(item);
    }
  }

  removeItem(item: any): void {
    if (confirm(`Remove ${item.book?.title || item.title} from cart?`)) {
      this.employeeService.removeFromCart(item.book?.id || item.id).subscribe({
        next: () => this.loadCart(),
        error: (err) => console.error('Error removing item:', err)
      });
    }
  }

  updateCartItem(item: any): void {
    this.employeeService.addToCart({
      book_id: item.book?.id || item.id,
      quantity: item.quantity
    }).subscribe({
      next: () => this.calculateTotal(),
      error: (err) => console.error('Error updating cart item:', err)
    });
  }

  /*** Checkout & Address Selection ***/
 openAddressSelector(): void {
  if (this.savedAddresses.length > 0) {
    this.showAddressSelector = true;
  } else {
    this.showQuickAddressForm = true; // 🔥 FIX
  }
}
  loadStates() {
  this.commonService.getStates().subscribe({
    next: (res) => {
      this.states = res;

      // Create ID → Name map
      this.stateMap = {};
      res.forEach((s: any) => {
        this.stateMap[s.id] = s.name;
      });
    },
    error: (err) => {
      console.error('Error loading states', err);
    }
  });
}
  cancelAddressSelection(): void {
    this.showAddressSelector = false;
  }

  onAddressSelected(addr: Address): void {
    this.selectedAddress = addr;
    this.isAddressSelected = true;
    this.showAddressSelector = false;
  }

 placeOrderAndPay(): void {
  if (!this.selectedAddress) {
    return alert('Please select an address!');
  }

  // Prepare payload for single API
  const payload = {
    address_id: this.selectedAddress.id,
    items: this.cartItems.map(item => ({
      book_id: item.book?.id || item.id,
      quantity: item.quantity
    }))
  };

  console.log('[Order] Payload prepared for cart:', payload);

  // Step 1: Create Order
  this.commonService.placeOrder(payload).subscribe({
    next: (res: any) => {
      console.log('[Order] Order created successfully:', res);

      const orderId = res.order_id;
      const totalAmount = res.total_amount;

      // Step 2: Create Razorpay Payment
      this.commonService.createPayment(orderId).subscribe({
        next: (paymentRes: any) => {
          const options = {
            key: paymentRes.razorpay_key,
            amount: paymentRes.amount,
            currency: paymentRes.currency,
            name: 'ReadGoodBooks',
            description: 'Cart Purchase',
            order_id: paymentRes.razorpay_order_id,
            prefill: {
              name: 'Customer', // optionally get user name
              email: 'customer@email.com',
              contact: '9999999999'
            },
            notes: { order_id: orderId.toString() },
            theme: { color: '#3399cc' },
            handler: (response: any) => {
              // Step 3: Verify Payment
              this.verifyPayment(response);
            }
          };

          const rzp = new Razorpay(options);
          rzp.on('payment.failed', (response: any) => {
            alert(response.error.description);
          });

          rzp.open();
        },
        error: (err) => console.error('[Payment] Error creating Razorpay order:', err)
      });
    },
    error: (err) => console.error('[Order] Error placing order:', err)
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
      next: (res: any) => { // Access the response from your backend here
        alert('Payment successful!');
        
        // 1. Clear the local cart state
        this.cartItems = [];
        this.totalAmount = 0;

        // 2. Navigate using the ID returned from your backend
        // Assuming your backend returns { order_id: 123 } or similar
        const orderId = res.order_id || res.id; 
        
        if (orderId) {
          this.router.navigate(['/customer', 'orders', orderId]);
        } else {
          console.error('Order ID not found in verification response');
          this.router.navigate(['/customer/orders']); // Fallback to list
        }
      },
      error: (err) => {
        console.error('Verification failed', err);
        alert('Payment verification failed!');
      }
    });
}
continueShopping(): void {
  this.router.navigate(['/customer']);  
}
initQuickForm() {
  this.quickAddressForm = this.fb.group({
    address_line_1: ['', Validators.required],
    address_line_2: [''],
    landmark: [''],
    city: ['', Validators.required],
    state: ['', Validators.required],
    pincode: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
    phone_number: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]
  });
}
saveQuickAddress() {
  if (this.quickAddressForm.invalid) return;

  this.employeeService.saveAddress(this.quickAddressForm.value).subscribe({
    next: (res: any) => {
      // 🔥 auto select
      this.selectedAddress = {
        id: String(res.id),
        line1: res.address_line_1,
        line2: res.address_line_2,
        city: res.city,
        state: res.state,
        zip: res.pincode,
        phone_number: res.phone_number
      };

      this.isAddressSelected = true;
      this.showQuickAddressForm = false;

      alert('Address added successfully!');
    },
    error: () => alert('Failed to save address')
  });
}
}
