import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCourseFormComponent } from './user-course-form.component';

describe('UserCourseFormComponent', () => {
  let component: UserCourseFormComponent;
  let fixture: ComponentFixture<UserCourseFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCourseFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCourseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
