import { AfterContentInit, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-user-course-form',
  standalone: true,
  imports: [ FormsModule ],
  templateUrl: './user-course-form.component.html',
  styleUrl: './user-course-form.component.scss'
})
export class UserCourseFormComponent implements AfterContentInit {

  // Form
  @ViewChild("userCourseForm", { static: true }) userCourseForm?: NgForm;
  @Output("form") formEmitter = new EventEmitter<NgForm>();

  ngAfterContentInit() {
    this.formEmitter.emit(this.userCourseForm);
  }

  submit(form: NgForm) {
    this.formEmitter.emit(form);
  }

}
