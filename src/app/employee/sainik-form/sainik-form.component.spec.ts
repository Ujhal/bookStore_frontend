import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SainikFormComponent } from './sainik-form.component';

describe('SainikFormComponent', () => {
  let component: SainikFormComponent;
  let fixture: ComponentFixture<SainikFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SainikFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SainikFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
