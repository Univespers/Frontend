import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthType } from 'src/app/entities/auth/auth.model';
import { EndpointUtils, ErrorResponse } from 'src/app/utils/endpoint-utils';

@Injectable({
  providedIn: 'root'
})
export class AuthEndpointService {

  private mock = true; // TODO: (Auth) Remover mocks

  private apiEndpoint = "http://localhost:3000/api"; // TODO: (Auth) Endpoint
  private authEndpoint = `${this.apiEndpoint}/user`;
  private authSigninEndpoint = `${this.authEndpoint}/new`;
  private authLoginEndpoint = `${this.authEndpoint}/login`;

  constructor(
    private http: HttpClient
  ) {}

  // Signin
  public registerUser(email: string, password: string): Observable<AuthOkResponse> {

    if(this.mock) {
      const response = JSON.parse(`{
        "id": "abc123",
        "tipo": "STUDENT",
        "token": "123456abcdef",
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
          password: password,
          returnSecureToken: true
        }
      )
    );
  }

  // Login
  public loginUser(email: string, password: string): Observable<AuthOkResponse> {

    if(this.mock) {
      let response = JSON.parse(`{
        "error": {
          "message": "EMAIL_NOT_FOUND"
        }
      }`);
      if(email == "aluno" && password == "1234") {
        response = JSON.parse(`{
          "id": "abc123",
          "tipo": "STUDENT",
          "token": "123456abcdef",
          "validade": 3600000
        }`);
      }
      return EndpointUtils.endpointHandler<AuthResponseData, AuthOkResponse, AuthErrorResponse>(
        EndpointUtils.mockEndpoint(response)
      );
    } // TODO: (Auth) Remover mock

    return EndpointUtils.endpointHandler<AuthResponseData, AuthOkResponse, AuthErrorResponse>(
      this.http.post<AuthResponseData>(
        this.authLoginEndpoint,
        {
          email: email,
          password: password,
          returnSecureToken: true
        }
      )
    );
  }

}

// Backend response model
export interface AuthOkResponse {
  id: string; // ID único
  tipo: AuthType; // "STUDENT" | "ADMIN"
  token: string; // Token = String de números e letras aleatórios
  validade: string; // Data de validade, em milissegundos (3600000 = 1h antes do logout automático)
}
export interface AuthErrorResponse extends ErrorResponse {}
export type AuthResponseData = AuthOkResponse | AuthErrorResponse;
