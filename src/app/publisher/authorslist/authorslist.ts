import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../mat-element';
import { AdminService } from '../../admin/admin-service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-authorslist',
   imports: [CommonModule, MaterialModule],
  templateUrl: './authorslist.html',
  styleUrl: './authorslist.css'
})
export class Authorslist implements OnInit {
  authors: any[] = [];
  displayedColumns = ['id', 'name', 'nationality', 'date_of_birth', 'date_of_death', 'photo'];

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    this.loadAuthors();
  }

  loadAuthors(): void {
    this.adminService.getAuthors().subscribe({
      next: (data) => this.authors = data,
      error: (err) => console.error('Error loading authors:', err)
    });
  }

 onEdit(author: any): void {
  this.router.navigate(['/admin/masters/authors/edit/', author.id]);
}

  onDelete(authorId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the author.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then(result => {
      if (result.isConfirmed) {
        this.adminService.deleteAuthor(authorId).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Author deleted successfully.', 'success');
            this.loadAuthors();
          },
          error: (err) => {
            console.error('Error deleting author:', err);
            Swal.fire('Error', 'Failed to delete author.', 'error');
          }
        });
      }
    });
  }
}
