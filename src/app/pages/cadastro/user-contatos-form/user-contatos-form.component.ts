import { AfterContentInit, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-user-contatos-form',
  standalone: true,
  imports: [ FormsModule ],
  templateUrl: './user-contatos-form.component.html',
  styleUrl: './user-contatos-form.component.scss'
})
export class UserContatosFormComponent implements AfterContentInit {

  // Form
  @ViewChild("userContatosForm", { static: true }) userContatosForm?: NgForm;
  @Output("form") formEmitter = new EventEmitter<NgForm>();

  ngAfterContentInit() {
    this.formEmitter.emit(this.userContatosForm);
  }

  submit(form: NgForm) {
    this.formEmitter.emit(form);
  }

}
