import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedTableReportComponent } from './shared-table-report.component';

describe('SharedTableReportComponent', () => {
  let component: SharedTableReportComponent;
  let fixture: ComponentFixture<SharedTableReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedTableReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedTableReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
