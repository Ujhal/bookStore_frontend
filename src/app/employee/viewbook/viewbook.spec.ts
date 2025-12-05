import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Viewbook } from './viewbook';

describe('Viewbook', () => {
  let component: Viewbook;
  let fixture: ComponentFixture<Viewbook>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Viewbook]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Viewbook);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
