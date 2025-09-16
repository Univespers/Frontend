import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { EndpointUtils, ErrorResponse } from '../endpoint-utils';

@Injectable({
  providedIn: 'root'
})
export class ColegasEndpointService {

  private mock = true; // TODO: (Colegass) Remover mocks

  private apiEndpoint = "http://localhost:3000/api"; // TODO: (Colegass) Endpoint
  private colegasEndpoint = `${this.apiEndpoint}/estudante/colegas`;
  private colegaEndpoint = (uuid: string) => `${this.colegasEndpoint}/${uuid}`;
  private colegaDetailsEndpoint = (uuid: string) => `${this.colegasEndpoint}/${uuid}/detalhes`;

    constructor(
      private http: HttpClient
    ) {}

  // Colegas
  public getColega(uuid: string): Observable<ColegaResponse> {

    if(this.mock) {
      let response = JSON.parse(`{
        "uuid": "abc123",
        "nome": "Aluno1",
        "curso": "Curso1",
        "polo": "Polo1"
      }`);
      return EndpointUtils.endpointHandler<ColegaResponseData, ColegaResponse, ColegaErrorResponse>(
        EndpointUtils.mockEndpoint(response)
      );
    } // TODO: (Colega) Remover mock

    return EndpointUtils.endpointHandler<ColegaResponseData, ColegaResponse, ColegaErrorResponse>(
      this.http.get<ColegaResponseData>(
        this.colegaEndpoint(uuid)
      )
    );
  }

  // Colega Details
  public getColegaDetails(uuid: string): Observable<ColegaDetailsResponse> {

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
        : `{
          "uuid": "abc123",
          "nome": "Aluno",
          "curso": "Curso",
          "polo": "Polo"
        }`
      );
      return EndpointUtils.endpointHandler<ColegaResponseData, ColegaDetailsResponse, ColegaErrorResponse>(
        EndpointUtils.mockEndpoint(response)
      );
    } // TODO: (Colega) Remover mock

    return EndpointUtils.endpointHandler<ColegaResponseData, ColegaDetailsResponse, ColegaErrorResponse>(
      this.http.get<ColegaResponseData>(
        this.colegaDetailsEndpoint(uuid)
      )
    );
  }

  // All Colegas
  public searchColegas(query: string, page: number): Observable<ColegaListResponse> {
    const pageQuantity = 10;
  
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
      return EndpointUtils.endpointHandler<ColegaResponseData, ColegaListResponse, ColegaErrorResponse>(
        EndpointUtils.mockEndpoint(response)
      );
    } // TODO: (Colegas) Remover mock

    return EndpointUtils.endpointHandler<ColegaResponseData, ColegaListResponse, ColegaErrorResponse>(
      this.http.get<ColegaResponseData>(
        this.colegasEndpoint,
        {
          params: new HttpParams().set("termo", query).set("pagina", page).set("quantidade", pageQuantity)
        }
      )
    );
  }

}

// Backend response model
export interface ColegaResponse {
  uuid: string; // ID único
  nome: string; // Nome
  curso: string; // Curso
  polo: string; // Polo
}
export interface ColegaDetailsResponse extends ColegaResponse {
  // Inclui tudo de ColegasResponse
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
export interface ColegaListResponse {
  lista: ColegaResponse[];
  pagina: number;
  totalPaginas: number;
}
export interface ColegaErrorResponse extends ErrorResponse {}
export type ColegaResponseData = ColegaResponse | ColegaDetailsResponse | ColegaListResponse | ColegaErrorResponse;
