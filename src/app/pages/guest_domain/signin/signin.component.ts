import { Component } from '@angular/core';

import { RequiresSave } from '../../requires-save.interface';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent implements RequiresSave {
  isChanged = false;
  alertMessage = "Campos preenchidos serão perdidos! Deseja mesmo sair?";

  hasUnsavedChanges() {
    return this.isChanged;
  }
}
