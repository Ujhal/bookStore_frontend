import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Privacypolicycomponent } from './privacypolicycomponent';

describe('Privacypolicycomponent', () => {
  let component: Privacypolicycomponent;
  let fixture: ComponentFixture<Privacypolicycomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Privacypolicycomponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Privacypolicycomponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
