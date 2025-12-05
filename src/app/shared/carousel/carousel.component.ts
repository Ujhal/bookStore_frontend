import { Component, OnInit } from '@angular/core';
import { CommonService } from '../shared_service/common.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MaterialModule } from '../../mat-element';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {
  books: any[] = [];

  constructor(private commonService: CommonService,private router:Router) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.commonService.getBooks().subscribe({
      next: (data) => (this.books = data),
      error: (err) => console.error('Error loading books:', err)
    });
  }
  viewBook(id: number): void {
  this.router.navigate(['/view-book', id]);
}
}
