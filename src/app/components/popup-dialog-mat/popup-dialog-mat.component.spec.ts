import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupDialogMatComponent } from './popup-dialog-mat.component';

describe('PopupDialogMatComponent', () => {
  let component: PopupDialogMatComponent;
  let fixture: ComponentFixture<PopupDialogMatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupDialogMatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupDialogMatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
