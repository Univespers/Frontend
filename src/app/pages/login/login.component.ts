import { Component, AfterContentInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformServer } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, Observable } from 'rxjs';

import { LoadingComponent } from 'src/app/components/loading/loading.component';
import { ThemeService, Theme } from 'src/app/features/theme.service';
import { AuthService } from 'src/app/features/auth/auth.service';
import { CurrentStatus } from 'src/app/current-status';

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
    if(CurrentStatus.DEBUG_MODE) console.log("[LOGIN_PAGE] Update theme");
    this.themeService.setBackgroundTheme(Theme.Light);
  }

  // Submit
  submit(form: any) {
    if(CurrentStatus.DEBUG_MODE) console.log("[LOGIN_PAGE] Submit: DOING");
    if(CurrentStatus.DEBUG_MODE) console.log("[LOGIN_PAGE] Form:");
    if(CurrentStatus.DEBUG_MODE) console.log(form.value);
    if(CurrentStatus.DEBUG_MODE) console.log("[LOGIN_PAGE] isFormValid: " + form.valid);

    this.isLoading = true;

    if(!form.valid) return;

    const email = form.value.userEmail;
    const password = form.value.userPassword;

    this.login(email, password)
      .pipe(
        finalize(() => {
          this.isLoading = false; // Desliga animação
        })
      )
      .subscribe({
        next: (data) => {
          form.reset(); // Reset form
          if(CurrentStatus.DEBUG_MODE) console.log("[LOGIN_PAGE] Submit: DONE");
        },
        error: (error) => {
          this.error = error; // Informa erro
          if(CurrentStatus.DEBUG_MODE) console.log("[LOGIN_PAGE] Submit: ERROR");
          if(CurrentStatus.DEBUG_MODE) console.log(error);
        }
      });
  }

  // Login
  login(email: string, password: string): Observable<boolean> {
    if(CurrentStatus.DEBUG_MODE) console.log("[LOGIN_PAGE] Login: DOING");
    return new Observable(subscriber => {
      this.authService.login(email, password).subscribe({
        next: (data) => {
          switch(true) {
            case this.authService.isUserEstudante():
              this.redirectToColegas()
              break;
          }
          if(CurrentStatus.DEBUG_MODE) console.log("[LOGIN_PAGE] Login: DONE");
          subscriber.next(true);
          subscriber.complete();
        },
        error: (error) => {
          if(CurrentStatus.DEBUG_MODE) console.log("[LOGIN_PAGE] Login: ERROR");
          if(CurrentStatus.DEBUG_MODE) console.log(error);
          subscriber.error(error);
        }
      });
    });
  }

  // Redirects
  redirectToCadastro() {
    if(CurrentStatus.DEBUG_MODE) console.log("[LOGIN_PAGE] Redirect to Cadastro");
    this.router.navigate([ "/cadastro" ]);
  }
  redirectToColegas() {
    if(CurrentStatus.DEBUG_MODE) console.log("[LOGIN_PAGE] Redirect to Colegas");
    this.router.navigate([ "/colegas" ]);
  }

}
