import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { EndpointUtils, ErrorResponse } from '../utils/endpoint-utils';

@Injectable({
  providedIn: 'root'
})
export class ColleagueEndpointService {

  private mock = true; // TODO: (Colleagues) Remover mocks

  private apiEndpoint = "http://localhost:3000/api"; // TODO: (Colleagues) Endpoint
  private colleaguesEndpoint = `${this.apiEndpoint}/colleagues`;
  private allColleaguesEndpoint = `${this.colleaguesEndpoint}/list`;
  private colleagueDetailsEndpoint = (id: string) => `${this.colleaguesEndpoint}/${id}/details`;
  private colleagueEndpoint = (id: string) => `${this.colleaguesEndpoint}/${id}`;

    constructor(
      private http: HttpClient
    ) {}

  // Colleague
  public getColleague(id: string): Observable<ColleagueResponse> {

    if(this.mock) {
      let response = JSON.parse(`{
        "id": "abc123",
        "nome": "Aluno1",
        "curso": "Curso1",
        "polo": "Polo1"
      }`);
      return EndpointUtils.endpointHandler<ColleagueResponseData, ColleagueResponse, ColleagueErrorResponse>(
        EndpointUtils.mockEndpoint(response)
      );
    } // TODO: (Colleagues) Remover mock

    return EndpointUtils.endpointHandler<ColleagueResponseData, ColleagueResponse, ColleagueErrorResponse>(
      this.http.get<ColleagueResponseData>(
        this.colleagueEndpoint(id)
      )
    );
  }

  // Colleague Details
  public getColleagueDetails(id: string): Observable<ColleagueDetailsResponse> {

    if(this.mock) {
      let response = JSON.parse(`{
        "id": "abc123",
        "nome": "Aluno1",
        "curso": "Curso1",
        "polo": "Polo1",
        "emailInstitucional": "aluno1@email.com",
        "descricao": "Oy! Hellow!",
        "contatos": {
          "email": "aluno1@personalEmail.com",
          "linkedin": "aluno1"
        }
      }`);
      return EndpointUtils.endpointHandler<ColleagueResponseData, ColleagueDetailsResponse, ColleagueErrorResponse>(
        EndpointUtils.mockEndpoint(response)
      );
    } // TODO: (Colleagues) Remover mock

    return EndpointUtils.endpointHandler<ColleagueResponseData, ColleagueDetailsResponse, ColleagueErrorResponse>(
      this.http.get<ColleagueResponseData>(
        this.colleagueDetailsEndpoint(id)
      )
    );
  }

  // All Colleagues
  public getAllColleagues(): Observable<ColleagueListResponse> {
  
    if(this.mock) {
      let response = JSON.parse(`{
        "lista": [
          {
              "id": "abc123_1",
              "nome": "Aluno1",
              "curso": "Curso1",
              "polo": "Polo1"
          },
          {
              "id": "abc123_2",
              "nome": "Aluno2",
              "curso": "Curso2",
              "polo": "Polo2"
          },
          {
              "id": "abc123_3",
              "nome": "Aluno3",
              "curso": "Curso3",
              "polo": "Polo3"
          }
        ]
      }`);
      return EndpointUtils.endpointHandler<ColleagueResponseData, ColleagueListResponse, ColleagueErrorResponse>(
        EndpointUtils.mockEndpoint(response)
      );
    } // TODO: (Colleagues) Remover mock

    return EndpointUtils.endpointHandler<ColleagueResponseData, ColleagueListResponse, ColleagueErrorResponse>(
      this.http.get<ColleagueResponseData>(
        this.allColleaguesEndpoint
      )
    );
  }

}

// Backend response model
export interface ColleagueResponse {
  id: string; // ID único
  nome: string; // Nome
  curso: string; // Curso
  polo: string; // Polo
}
export interface ColleagueDetailsResponse extends ColleagueResponse {
  // Inclui tudo de ColleagueResponse
  emailInstitucional: string;
  telefone?: string;
  descricao?: string;
  contatos?: {
    email?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    discord?: string;
    github?: string;
    reddit?: string;
  }
}
export interface ColleagueListResponse {
  lista: ColleagueResponse[];
}
export interface ColleagueErrorResponse extends ErrorResponse {}
export type ColleagueResponseData = ColleagueResponse | ColleagueDetailsResponse | ColleagueListResponse | ColleagueErrorResponse;
