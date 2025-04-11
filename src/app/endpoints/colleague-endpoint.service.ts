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
        "name": "Aluno1",
        "course": "Curso1",
        "pole": "Polo1"
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
        "name": "Aluno1",
        "course": "Curso1",
        "pole": "Polo1",
        "studentEmail": "aluno1@email.com",
        "description": "Oy! Hellow!",
        "contacts": {
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
        "list": [
          {
              "id": "abc123_1",
              "name": "Aluno1",
              "course": "Curso1",
              "pole": "Polo1"
          },
          {
              "id": "abc123_2",
              "name": "Aluno2",
              "course": "Curso2",
              "pole": "Polo2"
          },
          {
              "id": "abc123_3",
              "name": "Aluno3",
              "course": "Curso3",
              "pole": "Polo3"
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
  name: string; // Nome
  course: string; // Curso
  pole: string; // Polo
}
export interface ColleagueDetailsResponse extends ColleagueResponse {
  // Inclui tudo de ColleagueResponse
  studentEmail: string;
  telephone?: string;
  description?: string;
  contacts?: {
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
  list: ColleagueResponse[];
}
export interface ColleagueErrorResponse extends ErrorResponse {}
export type ColleagueResponseData = ColleagueResponse | ColleagueDetailsResponse | ColleagueListResponse | ColleagueErrorResponse;
