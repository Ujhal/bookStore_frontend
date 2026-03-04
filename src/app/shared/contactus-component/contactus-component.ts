import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-contactus-component',
  imports: [RouterModule],
  templateUrl: './contactus-component.html',
  styleUrl: './contactus-component.css'
})
export class ContactusComponent {
constructor(private router: Router) {}
}
