import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addauthors } from './addauthors';

describe('Addauthors', () => {
  let component: Addauthors;
  let fixture: ComponentFixture<Addauthors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Addauthors]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Addauthors);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
