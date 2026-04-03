import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessingOrders } from './processing-orders';

describe('ProcessingOrders', () => {
  let component: ProcessingOrders;
  let fixture: ComponentFixture<ProcessingOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessingOrders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessingOrders);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
