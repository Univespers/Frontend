import { AfterContentInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-user-data-form',
  standalone: true,
  imports: [ FormsModule ],
  templateUrl: './user-data-form.component.html',
  styleUrl: './user-data-form.component.scss'
})
export class UserDataFormComponent implements AfterContentInit {

  // Form
  @ViewChild("userDataForm", { static: true }) userDataForm?: NgForm;
  @Output("form") formEmitter = new EventEmitter<NgForm>();

  ngAfterContentInit() {
    this.formEmitter.emit(this.userDataForm);
  }

  submit(form: NgForm) {
    this.formEmitter.emit(form);
  }

}
