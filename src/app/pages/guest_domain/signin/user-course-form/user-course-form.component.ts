import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-course-form',
  standalone: true,
  imports: [ FormsModule ],
  templateUrl: './user-course-form.component.html',
  styleUrl: './user-course-form.component.scss'
})
export class UserCourseFormComponent {

  submit(form: any) {
    console.log(form.value);
  }
}
