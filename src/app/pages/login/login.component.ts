import { Component, AfterContentInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformServer } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, Observable } from 'rxjs';

import { LoadingComponent } from 'src/app/components/loading/loading.component';
import { ThemeService, Theme } from 'src/app/features/theme.service';
import { AuthService } from 'src/app/features/auth/auth.service';

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

  // Submit
  submit(form: any) {
    this.isLoading = true;

    console.log(form.valid); // TODO: Deletar
    console.log(form.value); // TODO: Deletar

    // if(!form.valid) return; // TODO: (Login) Validar
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
        },
        error: (error) => {
          this.error = error; // Informa erro
        }
      });
  }

  // Login
  login(email: string, password: string): Observable<boolean> {
    return new Observable(subscriber => {
      this.authService.login(email, password).subscribe({
        next: (data) => {
          console.log("OK"); // TODO: Deletar
          switch(true) {
            case this.authService.isUserEstudante():
              this.redirectToColegas()
              break;
          }
          subscriber.next(true);
          subscriber.complete();
        },
        error: (error) => {
          console.log(error); // TODO: Deletar
          subscriber.error(error);
        }
      });
    });
  }

  // Redirects
  redirectToCadastro() {
    this.router.navigate([ "/cadastro" ]);
  }
  redirectToColegas() {
    this.router.navigate([ "/colegas" ]);
  }

}
