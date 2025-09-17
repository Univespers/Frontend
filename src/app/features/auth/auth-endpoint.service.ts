import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, map, Observable, of, tap } from 'rxjs';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { FirebaseApp } from '@angular/fire/app';
import { get, getDatabase, ref } from '@angular/fire/database';

import { AuthType } from 'src/app/features/auth/auth.model';
import { EndpointUtils, ErrorResponse } from '../endpoint-utils';
import { CurrentStatus } from 'src/app/current-status';

@Injectable({
  providedIn: 'root'
})
export class AuthEndpointService {

  private mock = true; // TODO: (Auth) Remover mocks

  private apiEndpoint = "http://localhost:3000/api"; // TODO: (Auth) Endpoint
  private authEndpoint = `${this.apiEndpoint}/usuario`;
  private authCadastroEndpoint = `${this.authEndpoint}/novo`;
  private authLoginEndpoint = `${this.authEndpoint}/login`;
  private authLogoutEndpoint = `${this.authEndpoint}/logout`;
  private static AUTH_ENDPOINT = ((userUID: string) => `auth/${userUID}/tipo`);

  constructor(
    private http: HttpClient,
    private fireApp: FirebaseApp
  ) {}

  // Cadastro
  public cadastro(email: string, password: string): Observable<AuthOkResponse> {

    createUserWithEmailAndPassword(getAuth(this.fireApp), email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("REGISTER_USER");
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error);
      });





    if(this.mock) {
      const response = JSON.parse(`{
        "token": "4bbff43d-2539-11f0-bd4c-14ebb6cd199a",
        "tipo": "ESTUDANTE",
        "validade": 3600000
      }`);
      return EndpointUtils.endpointHandler<AuthResponseData, AuthOkResponse, AuthErrorResponse>(
        EndpointUtils.mockEndpoint(response)
      );
    } // TODO: (Auth) Remover mock

    return EndpointUtils.endpointHandler<AuthResponseData, AuthOkResponse, AuthErrorResponse>(
      this.http.post<AuthResponseData>(
        this.authCadastroEndpoint,
        {
          email: email,
          password: password
        }
      )
    );
  }

  // Login
  public login(email: string, password: string): Observable<string> {
    if(CurrentStatus.MOCK.AUTH) {
      if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_ENDPOINT] MOCK Login");
      return of("");
    }
    if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_ENDPOINT] Login: DOING");
    return from(
      // Firebase login
      signInWithEmailAndPassword(getAuth(this.fireApp), email, password)
        .then((userCredential) => {
          const userUID = userCredential.user.uid;
          if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_ENDPOINT] Login: DONE");
          if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_ENDPOINT] User UID: " + userUID);
          return userUID;
        })
        .catch((error) => {
          if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_ENDPOINT] Login: ERROR");
          if(CurrentStatus.DEBUG_MODE) console.log(error);
        })
    ).pipe(
      map(data => (!data ? "" : data)) // Retorna sempre string
    );
  }

  // Logout
  public logout(): Observable<AuthOkResponse> {

    console.log("LOGOUT_USER");

    if(this.mock) {
      const response = JSON.parse(`{
        "response": "OK"
      }`);
      return EndpointUtils.endpointHandler<AuthResponseData, AuthOkResponse, AuthErrorResponse>(
        EndpointUtils.mockEndpoint(response)
      );
    } // TODO: (Auth) Remover mock

    return EndpointUtils.endpointHandler<AuthResponseData, AuthOkResponse, AuthErrorResponse>(
      this.http.get<AuthResponseData>(
        this.authLogoutEndpoint
      )
    );
  }

  // AuthType
  public getAuthType(userUID: string): Observable<string> {
    if(CurrentStatus.MOCK.AUTH) {
      if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_ENDPOINT] MOCK GetAuthType");
      return of("ESTUDANTE");
    }
    if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_ENDPOINT] GetAuthType: DOING");
    return new Observable<string>((subscriber) => {
      get(ref(getDatabase(this.fireApp), AuthEndpointService.AUTH_ENDPOINT(userUID)))
        .then((data) => {
          const authType = data.val();
          if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_ENDPOINT] GetAuthType: DONE");
          if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_ENDPOINT] User auth type: " + authType);
          subscriber.next(authType);
          subscriber.complete();
        })
        .catch((error) => {
          if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_ENDPOINT] GetAuthType: ERROR");
          if(CurrentStatus.DEBUG_MODE) console.log(error);
          subscriber.error(error);
        });
    });
  }

}

// Backend response model
export interface AuthOkResponse {
  response: "OK";
}
export interface AuthTokenResponse {
  tipo: AuthType; // "ESTUDANTE" | "ADMIN"
}
export interface AuthErrorResponse extends ErrorResponse {}
export type AuthResponseData = AuthOkResponse | AuthTokenResponse | AuthErrorResponse;
