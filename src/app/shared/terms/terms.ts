import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-terms',
  imports: [RouterModule],
  templateUrl: './terms.html',
  styleUrl: './terms.css'
})
export class Terms {
 constructor(private router: Router) {}

}
