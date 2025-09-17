import { Component, Inject, ViewEncapsulation  } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ColleagueResponse } from '../../endpoints/colleague-endpoint.service';

@Component({
  selector: 'app-popup-dialog-mat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatButtonModule
  ],
  templateUrl: './popup-dialog-mat.component.html',
  styleUrls: ['./popup-dialog-mat.component.scss'],
  encapsulation: ViewEncapsulation.None // NOVO: remove encapsulamento
})
export class PopupDialogMatComponent {
  groupTitle = '';
  groupSearchControl = new FormControl('');
  selectedUsers: ColleagueResponse[] = [];

  constructor(
    private dialogRef: MatDialogRef<PopupDialogMatComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { users$: ColleagueResponse[] }
  ) {}

  // NOVO: Função para exibir apenas o nome no input
  displayFn(user: ColleagueResponse): string {
    return user ? user.nome : '';
  }

  addUser(user: ColleagueResponse) {
    if (!this.selectedUsers.find(u => u.uuid === user.uuid)) {
      this.selectedUsers.push(user);
    }
    this.groupSearchControl.setValue('');
  }

  removeUser(user: ColleagueResponse) {
    this.selectedUsers = this.selectedUsers.filter(u => u.uuid !== user.uuid);
  }

  cancel() {
    this.dialogRef.close();
  }

  create() {
    if (!this.groupTitle || this.selectedUsers.length === 0) return;
    this.dialogRef.close({
      title: this.groupTitle,
      users: this.selectedUsers
    });
  }
}
