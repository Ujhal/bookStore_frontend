import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Authorslist } from './authorslist';

describe('Authorslist', () => {
  let component: Authorslist;
  let fixture: ComponentFixture<Authorslist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Authorslist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Authorslist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
