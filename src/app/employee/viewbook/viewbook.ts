import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../shared/shared_service/common.service';
import { CommonModule } from '@angular/common';
import { Address, AddAddress } from '../../shared/add-address/add-address';
import { EmployeeService } from '../../employee/employee-service';

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
  showAddressSelector: boolean = false;  // Controls visibility of address selector
  isAddressSelected: boolean = false;  // Flag to check if an address has been selected

  constructor(
    private route: ActivatedRoute, 
    private commonService: CommonService,
    private employeeService: EmployeeService,
  ) {}

  ngOnInit(): void {
    console.log(' i am from customers dashboard view book component');
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadBookDetails(id);
    }

    this.loadAddresses(); // Always load addresses
  }

  loadBookDetails(id: number): void {
    this.commonService.getBookById(id).subscribe({
      next: (data) => this.book = data,
      error: (err) => console.error('Error loading book:', err)
    });
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
addToCart(): void {
  if (!this.book) {
    alert('No book selected!');
    return;
  }

  const payload = {
    book_id: this.book.id,
    quantity: this.quantity
  };

  this.employeeService.addToCart(payload).subscribe({
    next: (res) => {
      alert(`${this.book.title} added to cart successfully!`);
    },
    error: (err) => {
      console.error('Error adding to cart', err);
      alert('Failed to add book to cart.');
    }
  });
}

  openAddressSelector() {
    if (this.savedAddresses.length > 0) {
      this.showAddressSelector = true;  // Show address selector when "Place Your Order" is clicked
    } else {
      alert('Please add an address to proceed!');
    }
  }

  cancelAddressSelection() {
    this.showAddressSelector = false;  // Close address selector without selecting
  }

  onAddressSelected(addr: Address) {
    this.selectedAddress = addr;
    this.isAddressSelected = true;  // Address has been selected
    this.showAddressSelector = false;  // Close address selector after selecting address
  }

  increaseQty(): void {
    this.quantity++;
  }

  decreaseQty(): void {
    if (this.quantity > 1) this.quantity--;
  }

  placeOrder(): void {
    if (!this.book || !this.selectedAddress) {
      alert('Please select an address before placing the order.');
      return;
    }

    const payload = {
      book_id: this.book.id,
      quantity: this.quantity,
      address_id: this.selectedAddress?.id,  // Use selected address
    };

    this.commonService.placeOrder(payload).subscribe({
      next: () => alert('Order placed successfully!'),
      error: (err) => console.error('Error placing order', err)
    });
  }
}
