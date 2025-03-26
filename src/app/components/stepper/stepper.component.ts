import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss'
})
export class StepperComponent implements OnInit {
  @Input("steps") quantityOfSteps = 1;
  @Input("index") currentStep = 0;
  stepsList:number[] = [];

  ngOnInit(): void {
    this.stepsList = Array.apply<number,any[],number[]>(0, Array(this.quantityOfSteps)); // For SOME REASON, this is necessary
    this.stepsList = this.stepsList.map((value, index) => index + 1);
  }

  @Output() nextStep = new EventEmitter<number>();
  setStep(index:number) {
    this.nextStep.emit(index);
  }
}
