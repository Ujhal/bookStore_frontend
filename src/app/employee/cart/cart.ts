
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../mat-element';
import { EmployeeService } from '../employee-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {
  cartItems: any[] = [];
  totalAmount: number = 0;

  constructor(private employeeService: EmployeeService, private router: Router) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    // If using backend:
    this.employeeService.getCart().subscribe({
      next: (res) => {
        this.cartItems = res.items || [];
        this.calculateTotal();
      },
      error: (err) => {
        console.error('Error loading cart:', err);
      }
    });

    // 👉 If still using localStorage for guest users:
    // const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    // this.cartItems = cart;
    // this.calculateTotal();
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
      this.employeeService.deleteCartItem(item.book?.id || item.id).subscribe({
        next: () => this.loadCart(),
        error: (err) => console.error('Error removing item:', err)
      });

      // 👉 LocalStorage fallback
      // let cart = JSON.parse(localStorage.getItem('cart') || '[]');
      // cart = cart.filter((b: any) => b.id !== item.id);
      // localStorage.setItem('cart', JSON.stringify(cart));
      // this.loadCart();
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

    // 👉 LocalStorage fallback
    // localStorage.setItem('cart', JSON.stringify(this.cartItems));
    // this.calculateTotal();
  }

  checkout(): void {
    alert('Proceeding to checkout!');
    this.router.navigate(['/checkout']);
  }
}
