import { AfterContentInit, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-user-curso-form',
  standalone: true,
  imports: [ FormsModule ],
  templateUrl: './user-curso-form.component.html',
  styleUrl: './user-curso-form.component.scss'
})
export class UserCursoFormComponent implements AfterContentInit {

  // Form
  @ViewChild("userCursoForm", { static: true }) userCursoForm?: NgForm;
  @Output("form") formEmitter = new EventEmitter<NgForm>();

  ngAfterContentInit() {
    this.formEmitter.emit(this.userCursoForm);
  }

  submit(form: NgForm) {
    this.formEmitter.emit(form);
  }

}
