import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './about-us.html',
  styleUrl: './about-us.css'
})
export class AboutUsComponent  {
 constructor(private router: Router) {}
}
