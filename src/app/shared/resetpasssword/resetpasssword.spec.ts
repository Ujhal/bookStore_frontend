import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Resetpasssword } from './resetpasssword';

describe('Resetpasssword', () => {
  let component: Resetpasssword;
  let fixture: ComponentFixture<Resetpasssword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Resetpasssword]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Resetpasssword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
