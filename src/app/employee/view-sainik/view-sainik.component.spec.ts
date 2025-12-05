import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSainikComponent } from './view-sainik.component';

describe('ViewSainikComponent', () => {
  let component: ViewSainikComponent;
  let fixture: ComponentFixture<ViewSainikComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewSainikComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewSainikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
