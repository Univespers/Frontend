import { Component, AfterContentInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformServer } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { LoadingComponent } from 'src/app/components/loading/loading.component';
import { ThemeService, Theme } from 'src/app/features/theme.service';
import { AuthService } from 'src/app/features/auth/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ CommonModule, FormsModule, LoadingComponent ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements AfterContentInit {

  public isLoading = false;
  public error: string = "";

  constructor(
    private themeService: ThemeService,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isLoading = isPlatformServer(platformId);
  }

  ngAfterContentInit() {
    this.themeService.setBackgroundTheme(Theme.Light);
  }

  // Form
  submit(form: any) {
    this.isLoading = true;

    console.log(form.valid); // TODO: Deletar
    console.log(form.value); // TODO: Deletar

    // if(!form.valid) return; // TODO: (Login) Validar
    const email = form.value.userEmail;
    const password = form.value.userPassword;
    this.authService.loginUser(email, password).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
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

  newAccount() {
    this.router.navigate([ "/cadastro" ]);
  }

}
