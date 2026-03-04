import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-returns',
  imports: [RouterModule],
  templateUrl: './returns.html',
  styleUrl: './returns.css'
})
export class Returns {
 constructor(private router: Router) {}

}
