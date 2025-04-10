import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';

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

  // Translates server errors into error messages
  private errorHandler(errorData: HttpErrorResponse) {
    switch(errorData.error?.message?? errorData.error?.error?.message) {
      case "NOT_FOUND":
        return throwError(() => new Error("Colega não encontrado!"));
      case "OPERATION_NOT_ALLOWED":
        return throwError(() => new Error("A entrada está desabilitada!"));
      case "TOO_MANY_ATTEMPTS_TRY_LATER":
        return throwError(() => new Error("Detectado atividades incomuns! Tente mais tarde!"));
      default:
        return throwError(() => new Error("Um erro ocorreu!"));
    } // TODO: (Colleagues) Definir erros
  }

  // Colleague
  public getColleague(id: string): Observable<ColleagueResponse> {

    if(this.mock) {
      let response = JSON.parse(`{
        "id": "abc123",
        "name": "Aluno1",
        "course": "Curso1",
        "pole": "Polo1"
      }`);
      return (new Observable<ColleagueResponseData>(subSubscriber => {
        setTimeout(() => {
          subSubscriber.next(response);
          subSubscriber.complete();
        }, 1200);
      }).pipe(
        switchMap(colleagueData => { // Server ok, but with an error = Server error
          const error = (colleagueData as ColleagueErrorResponse).error;
          if(error) {
            return throwError(() => new HttpErrorResponse({ error: error }));
          } else return of(colleagueData as ColleagueResponse);
        }),
        catchError(this.errorHandler) // Server error = Error message
      ));
    }
    // TODO: (Colleagues) Remover mock

    return this.http.get<ColleagueResponseData>(
      this.colleagueEndpoint(id)
    ).pipe(
      switchMap(colleagueData => { // Server ok, but with an error = Server error
        const error = (colleagueData as ColleagueErrorResponse).error;
        if(error) {
          return throwError(() => new HttpErrorResponse({ error: error }));
        } else return of(colleagueData as ColleagueResponse);
      }),
      catchError(this.errorHandler) // Server error = Error message
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
      return (new Observable<ColleagueResponseData>(subSubscriber => {
        setTimeout(() => {
          subSubscriber.next(response);
          subSubscriber.complete();
        }, 1200);
      }).pipe(
        switchMap(colleagueData => { // Server ok, but with an error = Server error
          const error = (colleagueData as ColleagueErrorResponse).error;
          if(error) {
            return throwError(() => new HttpErrorResponse({ error: error }));
          } else return of(colleagueData as ColleagueDetailsResponse);
        }),
        catchError(this.errorHandler) // Server error = Error message
      ));
    }
    // TODO: (Colleagues) Remover mock

    return this.http.get<ColleagueResponseData>(
      this.colleagueDetailsEndpoint(id)
    ).pipe(
      switchMap(colleagueData => { // Server ok, but with an error = Server error
        const error = (colleagueData as ColleagueErrorResponse).error;
        if(error) {
          return throwError(() => new HttpErrorResponse({ error: error }));
        } else return of(colleagueData as ColleagueDetailsResponse);
      }),
      catchError(this.errorHandler) // Server error = Error message
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
      return (new Observable<ColleagueResponseData>(subSubscriber => {
        setTimeout(() => {
          subSubscriber.next(response);
          subSubscriber.complete();
        }, 1200);
      }).pipe(
        switchMap(colleagueData => { // Server ok, but with an error = Server error
          const error = (colleagueData as ColleagueErrorResponse).error;
          if(error) {
            return throwError(() => new HttpErrorResponse({ error: error }));
          } else return of(colleagueData as ColleagueListResponse);
        }),
        catchError(this.errorHandler) // Server error = Error message
      ));
    }
    // TODO: (Colleagues) Remover mock
  
    return this.http.get<ColleagueResponseData>(
      this.allColleaguesEndpoint
    ).pipe(
      switchMap(colleagueData => { // Server ok, but with an error = Server error
        const error = (colleagueData as ColleagueErrorResponse).error;
        if(error) {
          return throwError(() => new HttpErrorResponse({ error: error }));
        } else return of(colleagueData as ColleagueListResponse);
      }),
      catchError(this.errorHandler) // Server error = Error message
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
export interface ColleagueErrorResponse {
  error: {
    message: string; // "EMAIL_NOT_FOUND" | "INVALID_PASSWORD" | "USER_DISABLED" | "EMAIL_EXISTS" | "OPERATION_NOT_ALLOWED" | "TOO_MANY_ATTEMPTS_TRY_LATER"
  };
}
export type ColleagueResponseData = ColleagueResponse | ColleagueListResponse | ColleagueDetailsResponse | ColleagueErrorResponse;
