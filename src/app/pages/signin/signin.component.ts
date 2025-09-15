import { AfterContentInit, Component, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { CommonModule, isPlatformServer } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import { LoadingComponent } from 'src/app/components/loading/loading.component';
import { RequiresSave } from 'src/app/features/requires-save.interface';
import { StepperComponent } from 'src/app/components/stepper/stepper.component';
import { UserDataFormComponent } from './user-data-form/user-data-form.component';
import { UserContactsFormComponent } from './user-contacts-form/user-contacts-form.component';
import { UserCourseFormComponent } from './user-course-form/user-course-form.component';
import { Theme, ThemeService } from 'src/app/features/theme.service';
import { AuthService } from 'src/app/features/auth/auth.service';
import { ProfileService } from 'src/app/features/profile/profile.service';
import { finalize, Observable, of, switchMap } from 'rxjs';
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
    private profileService: ProfileService,
    private router: Router,
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
  submit(userDataForm: any, userContactsForm: any, userCourseForm: any) {
    this.isLoading = true;

    // if(!form.valid) return; // TODO: (Cadastro) Validar

    if(!userDataForm || !userContactsForm || !userCourseForm) {
      this.isLoading = false;
      return;
    }

    console.log(userDataForm.value); // TODO: Deletar
    console.log(userContactsForm.value); // TODO: Deletar
    console.log(userCourseForm.value); // TODO: Deletar

    const name = userDataForm.value.userName;
    const institutionalEmail = userDataForm.value.userInstitutionalEmail;
    const telephone = userDataForm.value.userTelephone;
    const showTelephone = userDataForm.value.userShowTelephone;
    const isWhatsapp = userDataForm.value.userTelIsWhatsapp;
    const password = userDataForm.value.userPassword;
    const passwordConfirmation = userDataForm.value.userPasswordConfirmation;
    const description = userDataForm.value.userDescription;
    const showDescription = userDataForm.value.userShowDescription;

    const course = userCourseForm.value.userCourse;
    const pole = userCourseForm.value.userPole;
    const currentSemester = userCourseForm.value.userCurrentSemester;
    const interests = userCourseForm.value.userInterests;
    const skills = userCourseForm.value.userSkills;
    const subjects = userCourseForm.value.userSubjects;

    const personalEmail = userCourseForm.value.userPersonalEmail;
    const showPersonalEmail = userCourseForm.value.userShowPersonalEmail;
    const linkedin = userCourseForm.value.userLinkedIn;
    const showLinkedIn = userCourseForm.value.userShowLinkedIn;
    const facebook = userCourseForm.value.userFacebook;
    const showFacebook = userCourseForm.value.userShowFacebook;
    const instagram = userCourseForm.value.userInstagram;
    const showInstagram = userCourseForm.value.userShowInstagram;
    const discord = userCourseForm.value.userDiscord;
    const showDiscord = userCourseForm.value.userShowDiscord;
    const github = userCourseForm.value.userGitHub;
    const showGitHub = userCourseForm.value.userShowGitHub;
    const reddit = userCourseForm.value.userReddit;
    const showReddit = userCourseForm.value.userShowReddit;

    // if(!password || password !== passwordConfirmation) {
    //   this.isLoading = false;
    //   return;
    // }

    // Register User
    of(true).pipe(
      switchMap(data => this.authService.registerUser(institutionalEmail, password)),
      switchMap(data => this.authService.loginUser(institutionalEmail, password)),
      switchMap(data => this.profileService.createProfile(name, institutionalEmail, course, pole)),
      // switchMap(data => this.profileService.editProfile(
      //   name, institutionalEmail, telephone, isWhatsapp, description,
      //   showTelephone, showDescription,
      //   course, pole, currentSemester, interests, skills, subjects,
      //   personalEmail, linkedin, facebook, instagram, discord, github, reddit,
      //   showPersonalEmail, showLinkedIn, showFacebook, showInstagram, showDiscord, showGitHub, showReddit)),
      finalize(() => {
        this.isLoading = false;
        userDataForm.reset();
        userContactsForm.reset();
        userCourseForm.reset();
      })
    ).subscribe({
      next: (data) => {
        console.log("Cadastro: OK"); // TODO: Deletar
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
