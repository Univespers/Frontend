import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, concat, concatMap, map, mergeMap, Observable, switchMap, tap } from 'rxjs';

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
        tap(authType => {
          if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_SERVICE] Update Auth");
          this.auth = Auth.getAuth(<AuthType>authType); // Carrega Auth com o AuthType
        }),
        map(authType => true) // Se sucesso
      ))
    );
  }

  // Logout
  public logout(): Observable<AuthOkResponse> {
    return this.authEndpointService.logout();
  }

}