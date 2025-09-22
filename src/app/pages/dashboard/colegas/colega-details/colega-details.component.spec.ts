import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColegaDetailsComponent } from './colega-details.component';

describe('ColegaDetailsComponent', () => {
  let component: ColegaDetailsComponent;
  let fixture: ComponentFixture<ColegaDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColegaDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColegaDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
