import { Component, ViewChild } from '@angular/core';
import { MaterialModule } from '../../mat-element';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminService } from '../admin-service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: number;  
  role_name: string;     
  date_joined: string;
  created_by: string;
  created_date: string;
  is_active: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {


}
