import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../shared_service/common.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-view-book',
  imports: [CommonModule,FormsModule],
  templateUrl: './view-book.html',
  styleUrls: ['./view-book.css']
})
export class ViewBook implements OnInit  {
  book: any;
  quantity = 1;
  isLoggedIn: boolean = false;

  showCheckoutForm = false;

  form = {
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
    address_line_1: "",
    address_line_2: "",
    landmark: "",
    pincode: "",
    city: "",
    state: ""
  };

  constructor(
    private route: ActivatedRoute, 
    private commonService: CommonService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadBookDetails(id);
    }

    this.isLoggedIn = this.commonService.loggedIn.value;
  }

  loadBookDetails(id: number): void {
    this.commonService.getBookById(id).subscribe({
      next: (data) => this.book = data,
      error: (err) => console.error('Error loading book:', err)
    });
  }

  increaseQty(): void {
    this.quantity++;
  }

  decreaseQty(): void {
    if (this.quantity > 1) this.quantity--;
  }

  placeOrder(): void {
    if (!this.book || !this.isLoggedIn) return;

    const payload = {
      book_id: this.book.id,
      quantity: this.quantity,
    };

    this.commonService.placeOrder(payload).subscribe({
      next: () => alert('Order placed successfully!'),
      error: (err) => console.error('Error placing order', err)
    });
  }

  // --------------------------
  // NEW METHODS FOR POPUP FORM
  // --------------------------

  openCheckoutForm() {
    this.showCheckoutForm = true;
  }

  closeCheckoutForm() {
    this.showCheckoutForm = false;
  }

  placeOrderWithRegistration() {
    const payload = {
      ...this.form,
      book_id: this.book.id,
      quantity: this.quantity,
    };

    this.commonService.checkoutAndRegister(payload).subscribe({
      next: (res: any) => {
        alert("Account created & order placed successfully!");

        const token = res.access_token ?? res.token;
        if (token) {
          localStorage.setItem("token", token);
          this.commonService.loggedIn.next(true);
        }

        this.closeCheckoutForm();
      },

      error: (err) => {
        console.error("Error:", err);
        alert("Something went wrong!");
      }
    });
  }
}
