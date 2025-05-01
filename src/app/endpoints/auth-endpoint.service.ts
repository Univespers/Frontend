import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthType } from 'src/app/entities/auth/auth.model';
import { EndpointUtils, ErrorResponse } from 'src/app/utils/endpoint-utils';

@Injectable({
  providedIn: 'root'
})
export class AuthEndpointService {

  private mock = false; // TODO: (Auth) Remover mocks

  private apiEndpoint = "http://localhost:3000/api"; // TODO: (Auth) Endpoint
  private authEndpoint = `${this.apiEndpoint}/usuario`;
  private authSigninEndpoint = `${this.authEndpoint}/novo`;
  private authLoginEndpoint = `${this.authEndpoint}/login`;

  constructor(
    private http: HttpClient
  ) {}

  // Signin
  public registerUser(email: string, password: string): Observable<AuthOkResponse> {

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
        this.authSigninEndpoint,
        {
          email: email,
          password: password
        }
      )
    );
  }

  // Login
  public loginUser(email: string, password: string): Observable<AuthTokenResponse> {

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
