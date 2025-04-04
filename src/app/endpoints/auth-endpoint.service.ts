import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';

import { AuthType } from 'src/app/entities/auth/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthEndpointService {

  private authEndpoint = "https://AUTH_ENDPOINT"; // TODO: (Auth) Endpoint
  private authSigninEndpoint = `${this.authEndpoint}/user/new`;
  private authLoginEndpoint = `${this.authEndpoint}/user/login`;

  constructor(
    private http: HttpClient
  ) {}

  // Translates server errors into error messages
  private errorHandler(errorData: HttpErrorResponse) {
    switch(errorData.error?.message?? errorData.error?.error?.message) {
      case "EMAIL_NOT_FOUND":
        return throwError(() => new Error("Email não encontrado!"));
      case "INVALID_PASSWORD":
        return throwError(() => new Error("Senha incorreta!"));
      case "USER_DISABLED":
        return throwError(() => new Error("Usuário desativado!"));
      case "EMAIL_EXISTS":
        return throwError(() => new Error("Esse email já existe!"));
      case "OPERATION_NOT_ALLOWED":
        return throwError(() => new Error("A entrada está desabilitada!"));
      case "TOO_MANY_ATTEMPTS_TRY_LATER":
        return throwError(() => new Error("Detectado atividades incomuns! Tente mais tarde!"));
      default:
        return throwError(() => new Error("Um erro ocorreu!"));
    } // TODO: (Auth) Definir erros
  }

  // Signin
  public registerUser(email: string, password: string): Observable<AuthOkResponse> {

    const response = JSON.parse(`{
      "authId": "abc123",
      "authType": "STUDENT",
      "token": "123456abcdef",
      "expiresIn": 3600000
    }`);
    return new Observable<AuthResponseData>((subscriber) => {
      setTimeout(() => {
        subscriber.next(response);
        subscriber.complete();
      }, 2000);
    }).pipe(
      switchMap(authData => { // Server ok, but with an error = Server error
        const error = (authData as AuthErrorResponse).error;
        if(error) {
          return throwError(() => new HttpErrorResponse({ error: error }));
        } else return of(authData as AuthOkResponse);
      }),
      catchError(this.errorHandler) // Server error = Error message
    );
     // TODO: (Auth) Remover mock

    return this.http.post<AuthResponseData>(
      this.authSigninEndpoint,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(
      switchMap(authData => { // Server ok, but with an error = Server error
        const error = (authData as AuthErrorResponse).error;
        if(error) {
          return throwError(() => new HttpErrorResponse({ error: error }));
        } else return of(authData as AuthOkResponse);
      }),
      catchError(this.errorHandler) // Server error = Error message
    );
  }

  // Login
  public loginUser(email: string, password: string): Observable<AuthOkResponse> {

    let response = JSON.parse(`{
      "error": {
        "message": "EMAIL_NOT_FOUND"
      }
    }`);
    if(email == "aluno" && password == "1234") {
      response = JSON.parse(`{
        "authId": "abc123",
        "authType": "STUDENT",
        "token": "123456abcdef",
        "expiresIn": 3600000
      }`);
    }
    return (new Observable<AuthResponseData>(subSubscriber => {
      setTimeout(() => {
        subSubscriber.next(response);
        subSubscriber.complete();
      }, 2000);
    }).pipe(
      switchMap(authData => { // Server ok, but with an error = Server error
        const error = (authData as AuthErrorResponse).error;
        if(error) {
          return throwError(() => new HttpErrorResponse({ error: error }));
        } else return of(authData as AuthOkResponse);
      }),
      catchError(this.errorHandler) // Server error = Error message
    ));
    // TODO: (Auth) Remover mock

    return this.http.post<AuthResponseData>(
      this.authLoginEndpoint,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(
        switchMap(authData => { // Server ok, but with an error = Server error
          const error = (authData as AuthErrorResponse).error;
          if(error) {
            return throwError(() => new HttpErrorResponse({ error: error }));
          } else return of(authData as AuthOkResponse);
        }),
        catchError(this.errorHandler) // Server error = Error message
      );
  }

}

// Backend response model
export interface AuthOkResponse {
  authId: string; // Unique identifier
  authType: AuthType; // "STUDENT" | "ADMIN"
  token: string; // The actual token
  expiresIn: string; // Expiration time, in miliseconds (3600000 = 1h before auto-logout)
}
export interface AuthErrorResponse {
  error: {
    message: string; // "EMAIL_NOT_FOUND" | "INVALID_PASSWORD" | "USER_DISABLED" | "EMAIL_EXISTS" | "OPERATION_NOT_ALLOWED" | "TOO_MANY_ATTEMPTS_TRY_LATER"
  };
}
export type AuthResponseData = AuthOkResponse | AuthErrorResponse;
