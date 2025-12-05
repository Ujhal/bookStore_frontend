import { Component, Input} from '@angular/core';
import { SainikFormData } from '../../employee/sainik-form/models/sainik.models';
import {BackendSainikData} from '../shared_service/sainikdata';
import { MaterialModule } from '../../mat-element';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment.development';
@Component({
  selector: 'app-application-view',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './application-view.component.html',
  styleUrl: './application-view.component.css'
})
export class ApplicationViewComponent {

  @Input() data: BackendSainikData | null = null;
  environment = environment;



}
