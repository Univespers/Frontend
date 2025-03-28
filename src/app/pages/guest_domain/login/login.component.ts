import { Component, AfterContentInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ThemeService, Theme } from 'src/app/utils/theme.service';
import { AuthService } from 'src/app/utils/auth.service';
import { AuthType } from 'src/app/utils/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements AfterContentInit {

  constructor(
    private themeService: ThemeService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngAfterContentInit() {
    this.themeService.setBackgroundTheme(Theme.Light);
  }

  // Form
  submit(form: any) {
    console.log(form.value);
    if(form.value.userEmail == "aluno" && form.value.userPassword == "1234") {
      this.authService.setAuthType(AuthType.Student);
      this.router.navigate([ "/colegas" ]);
    } else {
      this.authService.setAuthType(AuthType.Guest);
    }
  }

}
