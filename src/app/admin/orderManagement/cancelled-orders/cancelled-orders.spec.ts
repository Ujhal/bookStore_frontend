import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelledOrders } from './cancelled-orders';

describe('CancelledOrders', () => {
  let component: CancelledOrders;
  let fixture: ComponentFixture<CancelledOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelledOrders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelledOrders);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
