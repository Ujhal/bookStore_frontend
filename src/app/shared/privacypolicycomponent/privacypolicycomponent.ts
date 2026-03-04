import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-privacypolicycomponent',
  imports: [RouterModule],
  templateUrl: './privacypolicycomponent.html',
  styleUrl: './privacypolicycomponent.css'
})
export class Privacypolicycomponent {
 constructor(private router: Router) {}

}
