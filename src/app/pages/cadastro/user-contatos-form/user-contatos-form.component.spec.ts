import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserContactsFormComponent } from './user-contatos-form.component';

describe('UserContactsFormComponent', () => {
  let component: UserContactsFormComponent;
  let fixture: ComponentFixture<UserContactsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserContactsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserContactsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
