import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeUserProfileComponent } from './see-user-profile.component';

describe('SeeUserProfileComponent', () => {
  let component: SeeUserProfileComponent;
  let fixture: ComponentFixture<SeeUserProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeeUserProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeeUserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
