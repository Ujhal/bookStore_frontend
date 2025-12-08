
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../mat-element';
import { EmployeeService } from '../employee-service';
import { Router } from '@angular/router';
import { Address, AddAddress } from '../../shared/add-address/add-address';
import { CommonService } from '../../shared/shared_service/common.service'; // for placeOrder


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, MaterialModule, AddAddress],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {cartItems: any[] = [];
  totalAmount: number = 0;

  savedAddresses: Address[] = [];
  selectedAddress?: Address;
  showAddressSelector: boolean = false;  
  isAddressSelected: boolean = false;  

  constructor(
    private employeeService: EmployeeService, 
    private commonService: CommonService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
    this.loadAddresses();
  }

  loadAddresses(): void {
    this.employeeService.getAddresses().subscribe({
      next: (res: any) => this.savedAddresses = res.map((a: any) => ({
        id: String(a.id),
        line1: a.address_line_1,
        line2: a.address_line_2,
        city: a.city,
        state: a.state,
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
      alert('Please add an address to proceed!');
    }
  }

  cancelAddressSelection(): void {
    this.showAddressSelector = false;
  }

  onAddressSelected(addr: Address): void {
    this.selectedAddress = addr;
    this.isAddressSelected = true;
    this.showAddressSelector = false;
  }

  placeOrder(): void {
    if (!this.selectedAddress || this.cartItems.length === 0) {
      alert('Please select an address and ensure your cart has items.');
      return;
    }

    // Prepare payload for backend
    const payload = {
      address_id: this.selectedAddress.id,
      items: this.cartItems.map(item => ({
        book_id: item.book?.id || item.id,
        quantity: item.quantity
      }))
    };

    this.commonService.placeOrder(payload).subscribe({
      next: (res) => {
        alert('Order placed successfully!');
        this.router.navigate(['/orders']); // redirect to orders page
      },
      error: (err) => {
        console.error('Error placing order:', err);
        alert('Failed to place order.');
      }
    });
  }
}
