import { Component, AfterContentInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ThemeService, Theme } from 'src/app/utils/theme.service';
import { AuthService } from 'src/app/entities/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements AfterContentInit {

  public error: string = "";

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

    console.log(form.valid); // TODO: Deletar
    console.log(form.value); // TODO: Deletar

    // if(!form.valid) return; // TODO: (Login) Validar
    const email = form.value.userEmail;
    const password = form.value.userPassword;
    this.authService.loginUser(email, password).subscribe({
      next: (data) => {
        console.log("OK"); // TODO: Deletar
        form.reset();
        switch(true) {
          case this.authService.isUserStudent():
            this.router.navigate([ "/colegas" ]);
            break;
        }
      },
      error: (error) => {
        console.log(error); // TODO: Deletar
        this.error = error;
      }
    });
  }

}
