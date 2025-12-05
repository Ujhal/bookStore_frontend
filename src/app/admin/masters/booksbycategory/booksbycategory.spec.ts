import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Booksbycategory } from './booksbycategory';

describe('Booksbycategory', () => {
  let component: Booksbycategory;
  let fixture: ComponentFixture<Booksbycategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Booksbycategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Booksbycategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
