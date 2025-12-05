import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorsUpdate } from './authors-update';

describe('AuthorsUpdate', () => {
  let component: AuthorsUpdate;
  let fixture: ComponentFixture<AuthorsUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorsUpdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorsUpdate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
