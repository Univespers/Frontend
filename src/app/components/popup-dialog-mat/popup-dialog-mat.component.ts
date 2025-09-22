import { Component, Inject, ViewEncapsulation  } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ColegaResponse } from '../../features/colegas/colegas-endpoint.service';
import { ColegaService } from 'src/app/features/colegas/colegas.service';

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
  selectedUsers: ColegaResponse[] = [];
  allUsers: ColegaResponse[] = [];

  constructor(
    private dialogRef: MatDialogRef<PopupDialogMatComponent>,
    private colegaservice: ColegaService,
    @Inject(MAT_DIALOG_DATA) public data: { users$: ColegaResponse[] }
  ) {
    this.searchColegas("");
  }

  searchColegas(query: string) {
    this.colegaservice.searchColegas(query, 10).subscribe({
      next: (data) => {
        this.allUsers = data.list.map(colega => {
          return {
            uid: colega.uid,
            nome: colega.name,
            curso: colega.course,
            polo: colega.pole
          };
        });
      },
      error: (error) => {
        // Error
      }
    });
  }

  // NOVO: Função para exibir apenas o nome no input
  displayFn(user: ColegaResponse): string {
    return user ? user.nome : '';
  }

  addUser(user: ColegaResponse) {
    if (!this.selectedUsers.find(u => u.uid === user.uid)) {
      this.selectedUsers.push(user);
    }
    this.groupSearchControl.setValue('');
  }

  removeUser(user: ColegaResponse) {
    this.selectedUsers = this.selectedUsers.filter(u => u.uid !== user.uid);
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
