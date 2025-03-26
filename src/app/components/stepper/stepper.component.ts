import { Component, ViewChild, ElementRef, Input, Output, EventEmitter, AfterContentInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss'
})
export class StepperComponent implements AfterContentInit, OnChanges {
  // The childs
  @ViewChild('contentContainer', { static: true }) contentContainer: ElementRef | undefined;

  // Here, "currentStep" follows some rules
  _currentStep = 0;
  @Input() set currentStep(nextStep: number) {
    // Enforces limits: 0 <= currentStep < this.quantityOfSteps
    nextStep = Math.min(nextStep, this.quantityOfSteps - 1);
    nextStep = Math.max(nextStep, 0);
    this._currentStep = nextStep;
    this.currentStepChange.emit(this._currentStep);
  }
  get currentStep(): number {
    return this._currentStep;
  }

  // Informs parent about "currentStep" value
  // It needs to be async!
  @Output() currentStepChange = new EventEmitter<number>(true);

  quantityOfSteps = 0;
  stepsList: number[] = []; // Used by the template

  ngAfterContentInit(): void {
    // Creates a list for the stepper-indicator
    this.quantityOfSteps = this.contentContainer?.nativeElement.children.length;
    this.stepsList = Array.apply<number,any[],number[]>(0, Array(this.quantityOfSteps)); // For SOME REASON, this is necessary
    this.stepsList = this.stepsList.map((value, index) => index + 1);
    this.updateStepper();
  }
  ngOnChanges(changes: SimpleChanges) {
    // Enforces limits: 0 <= currentStep < this.quantityOfSteps
    // It does work! But the getSet solution is preferred
    // let nextStep = changes["currentStep"].currentValue;
    // nextStep = Math.min(nextStep, this.quantityOfSteps - 1);
    // nextStep = Math.max(nextStep, 0);
    // if(this.currentStep != nextStep) {
    //   this.currentStep = nextStep;
    //   this.currentStepChange.emit(nextStep);
    // }
  }
  setStep(index:number) { // Updates currentStep
    this.currentStep = index;
    // this.currentStepChange.emit(this.currentStep);
    this.updateStepper();
  }
  updateStepper() { // Updates content based on currentStep
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
