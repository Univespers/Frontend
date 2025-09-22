import { Component } from '@angular/core';

import { RequiresSave } from 'src/app/features/requires-save.interface';

@Component({
  selector: 'app-perfil-edit',
  standalone: true,
  imports: [],
  templateUrl: './perfil-edit.component.html',
  styleUrl: './perfil-edit.component.scss'
})
export class PerfilEditComponent implements RequiresSave {
  isChanged = false;
  alertMessage = "Há mudanças não salvas! Deseja mesmo sair?";

  hasUnsavedChanges() {
    return this.isChanged;
  }
}
