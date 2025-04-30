import { AfterContentInit, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-user-contacts-form',
  standalone: true,
  imports: [ FormsModule ],
  templateUrl: './user-contacts-form.component.html',
  styleUrl: './user-contacts-form.component.scss'
})
export class UserContactsFormComponent implements AfterContentInit {

  // Form
  @ViewChild("userContactsForm", { static: true }) userContactsForm?: NgForm;
  @Output("form") formEmitter = new EventEmitter<NgForm>();

  ngAfterContentInit() {
    this.formEmitter.emit(this.userContactsForm);
  }

  submit(form: NgForm) {
    this.formEmitter.emit(form);
  }

}
