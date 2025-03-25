import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-data-form',
  standalone: true,
  imports: [ FormsModule ],
  templateUrl: './user-data-form.component.html',
  styleUrl: './user-data-form.component.scss'
})
export class UserDataFormComponent {

  submit(form: any) {
    console.log(form.value);
  }
}
