import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RequiresSave } from 'src/app/utils/requires-save.interface';
import { UserDataFormComponent } from './user-data-form/user-data-form.component';
import { UserContactsFormComponent } from './user-contacts-form/user-contacts-form.component';
import { UserCourseFormComponent } from './user-course-form/user-course-form.component';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    UserDataFormComponent,
    UserContactsFormComponent,
    UserCourseFormComponent,
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent implements RequiresSave {
  isChanged = false;
  alertMessage = "Campos preenchidos serão perdidos! Deseja mesmo sair?";
  hasUnsavedChanges() {
    return this.isChanged;
  }

  currentStep = 2;
  submit(form: any) {
    console.log(form.value);
  }
}
