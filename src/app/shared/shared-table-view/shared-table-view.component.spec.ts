import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedTableViewComponent } from './shared-table-view.component';

describe('SharedTableViewComponent', () => {
  let component: SharedTableViewComponent;
  let fixture: ComponentFixture<SharedTableViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedTableViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedTableViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
