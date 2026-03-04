import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-payments',
  imports: [RouterModule],
  templateUrl: './payments.html',
  styleUrl: './payments.css'
})
export class Payments {
 constructor(private router: Router) {}

}
