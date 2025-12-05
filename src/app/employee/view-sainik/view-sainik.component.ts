import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../employee-service';
import { SainikFormData } from '../sainik-form/models/sainik.models';
import { ApplicationViewComponent } from '../../shared/application-view/application-view.component';
import { BackendSainikData } from '../../shared/shared_service/sainikdata';

@Component({
  selector: 'app-view-sainik',
  standalone: true,
  imports: [CommonModule, ApplicationViewComponent],
  templateUrl: './view-sainik.component.html',
  styleUrls: ['./view-sainik.component.css'],
})
export class ViewSainikComponent implements OnInit {
  sainikData: BackendSainikData | null = null;

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
  const id_ic = this.route.snapshot.paramMap.get('id_ic');
  if (id_ic) {
    this.employeeService.getSainikDetails(id_ic).subscribe({
      next: (data) => {
        if (data) {
          this.sainikData = data;
          console.log('Sainik details loaded:', this.sainikData);
        } else {
          console.warn('No data returned for id_ic:', id_ic);
        }
      },
      error: (err) => console.error('Error loading sainik details:', err),
    });
  } else {
    console.error('No id_ic found in route.');
  }
}

}
