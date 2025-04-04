import { AfterContentInit, Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformServer } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LoadingComponent } from 'src/app/components/loading/loading.component';
import { RequiresSave } from 'src/app/utils/requires-save.interface';
import { StepperComponent } from 'src/app/components/stepper/stepper.component';
import { UserDataFormComponent } from './user-data-form/user-data-form.component';
import { UserContactsFormComponent } from './user-contacts-form/user-contacts-form.component';
import { UserCourseFormComponent } from './user-course-form/user-course-form.component';
import { Theme, ThemeService } from 'src/app/utils/theme.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    StepperComponent,
    UserDataFormComponent,
    UserContactsFormComponent,
    UserCourseFormComponent,
    LoadingComponent
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent implements AfterContentInit, RequiresSave {

  public isServer = false;

  constructor(
    private themeService: ThemeService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isServer = isPlatformServer(platformId);
  }

  ngAfterContentInit() {
    this.themeService.setBackgroundTheme(Theme.Dark);
  }

  // UnSaved message
  isChanged = false;
  alertMessage = "Campos preenchidos serão perdidos! Deseja mesmo sair?";
  hasUnsavedChanges() {
    return this.isChanged;
  }

  // Stepper
  currentStep: number = 0;
  nextStep() {
    this.currentStep++;
  }

  // Form
  submit(form: any) {
    console.log(form.value);
  }

}
