import { Component } from '@angular/core';

import { RequiresSave } from 'src/app/features/requires-save.interface';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.scss'
})
export class ProfileEditComponent implements RequiresSave {
  isChanged = false;
  alertMessage = "Há mudanças não salvas! Deseja mesmo sair?";

  hasUnsavedChanges() {
    return this.isChanged;
  }
}
