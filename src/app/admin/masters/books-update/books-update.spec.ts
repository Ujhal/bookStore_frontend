import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksUpdate } from './books-update';

describe('BooksUpdate', () => {
  let component: BooksUpdate;
  let fixture: ComponentFixture<BooksUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooksUpdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BooksUpdate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
