import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyOrderDetails } from './my-order-details';

describe('MyOrderDetails', () => {
  let component: MyOrderDetails;
  let fixture: ComponentFixture<MyOrderDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyOrderDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyOrderDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
