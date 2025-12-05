import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBooks } from './add-books';

describe('AddBooks', () => {
  let component: AddBooks;
  let fixture: ComponentFixture<AddBooks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBooks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBooks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
