import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { FirebaseApp } from '@angular/fire/app';
import { getDatabase, ref, set } from '@angular/fire/database';

import { AuthType } from 'src/app/features/auth/auth.model';
import { EndpointUtils, ErrorResponse } from '../endpoint-utils';

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

  constructor(
    private http: HttpClient,
    private fireApp: FirebaseApp
  ) {}

  // Cadastro
  public registerUser(email: string, password: string): Observable<AuthOkResponse> {

    const auth = getAuth(this.fireApp);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error);
      });




    console.log("REGISTER_USER");

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
  public loginUser(email: string, password: string): Observable<AuthTokenResponse> {

    const auth = getAuth(this.fireApp);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        console.log(user);

        set(ref(getDatabase(this.fireApp), `estudante/${user.uid}/teste`), "A");
        
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error);
      });
    
      



    console.log("LOGIN_USER");

    if(this.mock) {
      let response = JSON.parse(`{
        "error": {
          "message": "EMAIL_NOT_FOUND"
        }
      }`);
      if(email == "aluno" && password == "1234") {
        response = JSON.parse(`{
          "token": "4bbff43d-2539-11f0-bd4c-14ebb6cd199a",
          "tipo": "ESTUDANTE",
          "validade": 3600000
        }`);
      }
      return EndpointUtils.endpointHandler<AuthResponseData, AuthTokenResponse, AuthErrorResponse>(
        EndpointUtils.mockEndpoint(response)
      );
    } // TODO: (Auth) Remover mock

    return EndpointUtils.endpointHandler<AuthResponseData, AuthTokenResponse, AuthErrorResponse>(
      this.http.post<AuthResponseData>(
        this.authLoginEndpoint,
        {
          email: email,
          password: password
        }
      )
    );
  }

  // Logout
  public logoutUser(): Observable<AuthOkResponse> {

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

}

// Backend response model
export interface AuthOkResponse {
  response: "OK";
}
export interface AuthTokenResponse {
  tipo: AuthType; // "STUDENT" | "ADMIN"
  token: string; // Token = String de números e letras aleatórios
  validade: string; // Data de validade, em milissegundos (3600000 = 1h antes do logout automático)
}
export interface AuthErrorResponse extends ErrorResponse {}
export type AuthResponseData = AuthOkResponse | AuthTokenResponse | AuthErrorResponse;
