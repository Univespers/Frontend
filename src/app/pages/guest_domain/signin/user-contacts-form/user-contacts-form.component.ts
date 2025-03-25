import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-contacts-form',
  standalone: true,
  imports: [ FormsModule ],
  templateUrl: './user-contacts-form.component.html',
  styleUrl: './user-contacts-form.component.scss'
})
export class UserContactsFormComponent {

  submit(form: any) {
    console.log(form.value);
  }
}
