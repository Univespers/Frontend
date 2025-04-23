import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonPopupMenuComponent } from './button-popup-menu.component';

describe('ButtonPopupMenuComponent', () => {
  let component: ButtonPopupMenuComponent;
  let fixture: ComponentFixture<ButtonPopupMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonPopupMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonPopupMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
