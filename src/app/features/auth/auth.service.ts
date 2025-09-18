import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, concat, concatMap, first, map, mergeMap, Observable, of, switchMap, tap } from 'rxjs';

import { Auth, AuthType } from './auth.model';
import { AuthEndpointService, AuthOkResponse } from 'src/app/features/auth/auth-endpoint.service';
import { CurrentStatus } from 'src/app/current-status';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public auth: Auth = new Auth(AuthType.Visitante);

  constructor(
    private authEndpointService: AuthEndpointService
  ) {}

  private updateAuthType(authType: AuthType) {
    if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_SERVICE] Update Auth");
    if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_SERVICE] User auth type: " + authType);
    this.auth = Auth.getAuth(<AuthType>authType); // Carrega Auth com o AuthType
  }

  // Auth types
  public isUserEstudante() {
    return (this.auth?.type == AuthType.Estudante);
  }
  public isUserVisitante() {
    return (this.auth?.type == AuthType.Visitante || !this.auth?.type);
  }

  // Cadastro
  public cadastro(email: string, password: string): Observable<AuthOkResponse> {
    return this.authEndpointService.cadastro(email, password);
  }

  // Login
  public login(email: string, password: string): Observable<boolean> {
    if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_SERVICE] Call Login");
    return this.authEndpointService.login(email, password).pipe(
      switchMap(userUID => this.authEndpointService.getAuthType(userUID).pipe(
        tap(authType => this.updateAuthType(<AuthType>authType))
      )),
      map(authType => true) // Se sucesso
    );
  }

  // Login Manager
  public loginManager(): Observable<boolean> {
    if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_SERVICE] Call LoginManager");
    return this.authEndpointService.loginManager().pipe(
      first(),
      switchMap(userUID => {
        if(!userUID || userUID === true) {
          this.updateAuthType(AuthType.Visitante);
          return of("");
        }
        return this.authEndpointService.getAuthType(userUID).pipe(
          tap(authType => this.updateAuthType(<AuthType>authType))
        )
      }),
      map(authType => true) // Se sucesso
    );
  }

  // Logout
  public logout(): Observable<boolean> {
    return this.authEndpointService.logout().pipe(
      tap(() => {
        this.updateAuthType(AuthType.Visitante)
      })
    );
  }

}