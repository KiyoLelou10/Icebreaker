import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeAllUsersComponent } from './see-all-users.component';

describe('SeeAllUsersComponent', () => {
  let component: SeeAllUsersComponent;
  let fixture: ComponentFixture<SeeAllUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeeAllUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeeAllUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
