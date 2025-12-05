import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublisherUpdate } from './publisher-update';

describe('PublisherUpdate', () => {
  let component: PublisherUpdate;
  let fixture: ComponentFixture<PublisherUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublisherUpdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublisherUpdate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
