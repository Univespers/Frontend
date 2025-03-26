import { Component, ViewChild, ElementRef, Input, Output, EventEmitter, AfterContentInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss'
})
export class StepperComponent implements AfterContentInit {
  @ViewChild('contentContainer', { static: true }) contentContainer: ElementRef | undefined;
  quantityOfSteps = 1;
  @Input() currentStep = 0;
  @Output() currentStepChange = new EventEmitter<number>();
  stepsList:number[] = [];

  ngAfterContentInit(): void {
    this.quantityOfSteps = this.contentContainer?.nativeElement.children.length;
    this.stepsList = Array.apply<number,any[],number[]>(0, Array(this.quantityOfSteps)); // For SOME REASON, this is necessary
    this.stepsList = this.stepsList.map((value, index) => index + 1);
    this.updateStepper();
  }
  setStep(index:number) {
    this.currentStep = index;
    this.currentStepChange.emit(this.currentStep);
    this.updateStepper();
  }
  updateStepper() {
    // Hack incoming!
    for(let i = 0; i < this.quantityOfSteps; i++) {
      if(this.contentContainer != undefined) {
        let show = (i === this.currentStep);
        this.contentContainer.nativeElement.children[i].style.display = (
          show? "block" : "none"
        ); // Messing with non-Angular stuff (Not good!)
      }
    }
    // Hack done
  }

}
