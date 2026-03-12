import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export interface Address {
  id?: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  state_name?: string;
  zip?: string;
  phone_number?: string;
}

@Component({
  selector: 'app-add-address',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-address.html',
  styleUrls: ['./add-address.css']
})
export class AddAddress {
  @Input() addresses: Address[] = [];
  @Output() select = new EventEmitter<Address>();
  @Output() cancel = new EventEmitter<void>();

  selectedId?: string;

  constructor(private router: Router) {}

  choose(): void {
    const addr = this.addresses.find(a => a.id === this.selectedId);
    if (addr) this.select.emit(addr);
  }

  addNewAddress(): void {
    this.cancel.emit(); // close current modal first
    this.router.navigate(['/customer/my/addresses']);
  }
}
