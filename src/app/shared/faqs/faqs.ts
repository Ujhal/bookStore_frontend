import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-faqs',
  imports: [RouterModule],
  templateUrl: './faqs.html',
  styleUrl: './faqs.css'
})
export class Faqs {
 constructor(private router: Router) {}

}
