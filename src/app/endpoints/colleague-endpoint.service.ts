import { HttpClient, HttpParams } from '@angular/common/http';
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
  private colleagueDetailsEndpoint = (uuid: string) => `${this.colleaguesEndpoint}/${uuid}/details`;
  private colleagueEndpoint = (uuid: string) => `${this.colleaguesEndpoint}/${uuid}`;

    constructor(
      private http: HttpClient
    ) {}

  // Colleague
  public getColleague(uuid: string): Observable<ColleagueResponse> {

    if(this.mock) {
      let response = JSON.parse(`{
        "uuid": "abc123",
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
        this.colleagueEndpoint(uuid)
      )
    );
  }

  // Colleague Details
  public getColleagueDetails(uuid: string): Observable<ColleagueDetailsResponse> {

    if(this.mock) {
      let response = JSON.parse(
        (uuid == "abc123_1") ? `{
          "uuid": "abc123_1",
          "nome": "Aluno1",
          "curso": "Curso1",
          "polo": "Polo1",
          "emailInstitucional": "aluno1@estudante.com",
          "telefone": "(00) 90000-0000",
          "temWhatsapp": true,
          "descricao": "Oy! Hellow!",
          "contatos": {
            "email": "aluno1@email.com",
            "linkedin": "aluno1@linkedin",
            "github": "aluno1@github",
            "discord": "aluno1@discord"
          }
        }`
        : (uuid == "abc123_2") ? `{
          "uuid": "abc123_2",
          "nome": "Aluno2",
          "curso": "Curso2",
          "polo": "Polo2",
          "emailInstitucional": "aluno2@estudante.com",
          "contatos": {
            "email": "aluno1@email.com"
          }
        }`
        : (uuid == "abc123_3") ? `{
          "uuid": "abc123_3",
          "nome": "Aluno3",
          "curso": "Curso3",
          "polo": "Polo3",
          "emailInstitucional": "aluno3@estudante.com",
          "telefone": "(00) 90000-0000",
          "temWhatsapp": false,
          "descricao": "Alooo!",
          "contatos": {
            "email": "aluno3@email.com",
            "facebook": "aluno3@facebook",
            "instagram": "aluno3@instagram",
            "reddit": "aluno3@reddit"
          }
        }`
        : ""
      );
      return EndpointUtils.endpointHandler<ColleagueResponseData, ColleagueDetailsResponse, ColleagueErrorResponse>(
        EndpointUtils.mockEndpoint(response)
      );
    } // TODO: (Colleagues) Remover mock

    return EndpointUtils.endpointHandler<ColleagueResponseData, ColleagueDetailsResponse, ColleagueErrorResponse>(
      this.http.get<ColleagueResponseData>(
        this.colleagueDetailsEndpoint(uuid)
      )
    );
  }

  // All Colleagues
  public searchColleagues(query: string, page: number): Observable<ColleagueListResponse> {
  
    if(this.mock) {
      let response = JSON.parse(`{
        "lista": [
          {
              "uuid": "abc123_1",
              "nome": "Aluno1",
              "curso": "Curso1",
              "polo": "Polo1"
          },
          {
              "uuid": "abc123_2",
              "nome": "Aluno2",
              "curso": "Curso2",
              "polo": "Polo2"
          },
          {
              "uuid": "abc123_3",
              "nome": "Aluno3",
              "curso": "Curso3",
              "polo": "Polo3"
          }
        ],
        "pagina": 1,
        "totalPaginas": 2
      }`);
      return EndpointUtils.endpointHandler<ColleagueResponseData, ColleagueListResponse, ColleagueErrorResponse>(
        EndpointUtils.mockEndpoint(response)
      );
    } // TODO: (Colleagues) Remover mock

    return EndpointUtils.endpointHandler<ColleagueResponseData, ColleagueListResponse, ColleagueErrorResponse>(
      this.http.get<ColleagueResponseData>(
        this.allColleaguesEndpoint,
        {
          params: new HttpParams().set("pesquisa", query).set("pagina", 1)
        }
      )
    );
  }

}

// Backend response model
export interface ColleagueResponse {
  uuid: string; // ID único
  nome: string; // Nome
  curso: string; // Curso
  polo: string; // Polo
}
export interface ColleagueDetailsResponse extends ColleagueResponse {
  // Inclui tudo de ColleagueResponse
  emailInstitucional: string;
  telefone?: string;
  temWhatsapp?: boolean;
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
  pagina: number;
  totalPaginas: number;
}
export interface ColleagueErrorResponse extends ErrorResponse {}
export type ColleagueResponseData = ColleagueResponse | ColleagueDetailsResponse | ColleagueListResponse | ColleagueErrorResponse;
