import { AfterContentInit, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-user-dados-form',
  standalone: true,
  imports: [ FormsModule ],
  templateUrl: './user-dados-form.component.html',
  styleUrl: './user-dados-form.component.scss'
})
export class UserDadosFormComponent implements AfterContentInit {

  // Form
  @ViewChild("userDadosForm", { static: true }) userDadosForm?: NgForm;
  @Output("form") formEmitter = new EventEmitter<NgForm>();

  ngAfterContentInit() {
    this.formEmitter.emit(this.userDadosForm);
  }

  submit(form: NgForm) {
    this.formEmitter.emit(form);
  }

}
