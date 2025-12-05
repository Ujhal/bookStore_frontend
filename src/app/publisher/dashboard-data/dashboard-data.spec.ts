import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardData } from './dashboard-data';

describe('DashboardData', () => {
  let component: DashboardData;
  let fixture: ComponentFixture<DashboardData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardData]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardData);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
