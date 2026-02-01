import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippedOrders } from './shipped-orders';

describe('ShippedOrders', () => {
  let component: ShippedOrders;
  let fixture: ComponentFixture<ShippedOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShippedOrders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShippedOrders);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
