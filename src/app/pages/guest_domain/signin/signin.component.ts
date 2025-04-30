import { AfterContentInit, Component, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { CommonModule, isPlatformServer } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import { LoadingComponent } from 'src/app/components/loading/loading.component';
import { RequiresSave } from 'src/app/utils/requires-save.interface';
import { StepperComponent } from 'src/app/components/stepper/stepper.component';
import { UserDataFormComponent } from './user-data-form/user-data-form.component';
import { UserContactsFormComponent } from './user-contacts-form/user-contacts-form.component';
import { UserCourseFormComponent } from './user-course-form/user-course-form.component';
import { Theme, ThemeService } from 'src/app/utils/theme.service';
import { AuthService } from 'src/app/entities/auth/auth.service';
import { ProfileService } from 'src/app/entities/profile/profile.service';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';

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

  public isLoading = false;
  public error = "";

  @ViewChild("signin") signin?: NgForm;
  public userDataForm?: NgForm;
  public userContactsForm?: NgForm;
  public userCourseForm?: NgForm;

  constructor(
    private themeService: ThemeService,
    @Inject(PLATFORM_ID) platformId: Object,
    private authService: AuthService,
    private router: Router,
    private profileService: ProfileService,
  ) {
    this.isLoading = isPlatformServer(platformId);
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
    if(this.isLastStep()) {
      this.signin?.ngSubmit.emit(); // Trigger submit
    } else this.currentStep++;
  }
  isLastStep(): boolean {
    return (this.currentStep === 2);
  }

  // Form
  getUserDataForm(form: NgForm) {
    this.userDataForm = form;
  }
  getUserContactsForm(form: NgForm) {
    this.userContactsForm = form;
  }
  getUserCourseForm(form: NgForm) {
    this.userCourseForm = form;
  }
  submit(userData: any, userContacts: any, userCourse: any) {
    this.isLoading = true;

    // if(!form.valid) return; // TODO: (Cadastro) Validar

    if(!userData || !userContacts || !userCourse) {
      this.isLoading = false;
      return;
    }

    // console.log(userData.value); // TODO: Deletar
    // console.log(userContacts.value); // TODO: Deletar
    // console.log(userCourse.value); // TODO: Deletar

    const email = userData.value.userInstitutionalEmail;
    const password = userData.value.userPassword;
    const passwordConfirmation = userData.value.userPasswordConfirmation;

    if(!password || password !== passwordConfirmation) {
      this.isLoading = false;
      return;
    }

    this.authService.registerUser(email, password).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (data) => {
        console.log("OK"); // TODO: Deletar
        userData.reset();
        userContacts.reset();
        userCourse.reset();
        switch(true) {
          case this.authService.isUserStudent():
            this.router.navigate([ "/colegas" ]);
            break;
        }
      },
      error: (error) => {
        console.log(error); // TODO: Deletar
        this.error = error;
      }
    });
  }

}
