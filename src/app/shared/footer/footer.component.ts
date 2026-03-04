import { Component } from '@angular/core';
import { MaterialModule } from '../../mat-element';
import { Router,RouterModule } from '@angular/router';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MaterialModule,RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
constructor(private router: Router) {}

}
