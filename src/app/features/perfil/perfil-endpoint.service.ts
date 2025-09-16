import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { EndpointUtils, ErrorResponse } from '../endpoint-utils';

@Injectable({
  providedIn: 'root'
})
export class PerfilEndpointService {

  private mock = true; // TODO: (Perfil) Remover mocks

  private apiEndpoint = "http://localhost:3000/api"; // TODO: (Perfil) Endpoint
  private perfilEndpoint = `${this.apiEndpoint}/estudante`;
  private createPerfilEndpoint = `${this.perfilEndpoint}/novo`;
  private editPerfilEndpoint = `${this.perfilEndpoint}/editar`;

  constructor(
    private http: HttpClient
  ) {}

  // New Perfil
  public createPerfil(name: string, studentEmail: string, course: string, pole: string): Observable<PerfilOkResponse> {

    console.log("CREATE_PERFIL");
    
    if(this.mock) {
      const response = JSON.parse(`{
        "response": "OK"
      }`);
      return EndpointUtils.endpointHandler<PerfilResponseData, PerfilOkResponse, PerfilErrorResponse>(
        EndpointUtils.mockEndpoint(response)
      );
    } // TODO: (Perfil) Remover mock

    return EndpointUtils.endpointHandler<PerfilResponseData, PerfilOkResponse, PerfilErrorResponse>(
      this.http.post<PerfilResponseData>(
        this.createPerfilEndpoint,
        {
          nome: name,
          emailInstitucional: studentEmail,
          curso: course,
          polo: pole
        }
      )
    );
  }

  // Edit Perfil
  public editPerfil(
    name: string, studentEmail: string, telephone: string, isWhatsapp: boolean, description: string, courseName: string, poleName: string,
    showTelephone: boolean, showDescription: boolean,
    currentSemester: number, interests: string[], skills: string[], subjects: string[],
    email: string, linkedin: string, facebook: string, instagram: string, discord: string, github: string, reddit: string,
    showPersonalEmail: boolean, showLinkedIn: boolean, showFacebook: boolean, showInstagram: boolean, showDiscord: boolean, showGitHub: boolean, showReddit: boolean
  ): Observable<PerfilOkResponse> {

    if(this.mock) {
      const response = JSON.parse(`{
        "response": "OK"
      }`);
      return EndpointUtils.endpointHandler<PerfilResponseData, PerfilOkResponse, PerfilErrorResponse>(
        EndpointUtils.mockEndpoint(response)
      );
    } // TODO: (Perfil) Remover mock

    return EndpointUtils.endpointHandler<PerfilResponseData, PerfilOkResponse, PerfilErrorResponse>(
      this.http.post<PerfilResponseData>(
        this.editPerfilEndpoint,
        {
          nome: name,
          emailInstitucional: studentEmail,
          telefone: telephone,
          temWhatsapp: isWhatsapp,
          descricao: description,
          curso: courseName,
          polo: poleName,
          semestreAtual: currentSemester,
          interesses: interests,
          habilidades: skills,
          cursos: subjects,
          contatos: {
            email: email,
            linkedin: linkedin,
            facebook: facebook,
            instagram: instagram,
            discord: discord,
            github: github,
            reddit: reddit
          },
          mostrar: {
            telefone: showTelephone, descricao: showDescription,
            email: showPersonalEmail, linkedin: showLinkedIn, facebook: showFacebook,
            instagram: showInstagram, discord: showDiscord, github: showGitHub, reddit: showReddit
          }
        }
      )
    );
  }

  // Get Perfil
  public getPerfil(): Observable<PerfilResponse> {

    if(this.mock) {
      const response = JSON.parse(`{
        "uuid": "bb8f6181-25ec-11f0-bd4d-14ebb6cd199a",
        "nome": "Aluno",
        "curso": "Curso",
        "polo": "Polo",
        "emailInstitucional": "aluno@emailInstitucional",
        "telefone": "telefone",
        "temWhatsapp": true,
        "descricao": "Hellow",
        "contatos": {
          "email": "aluno@email",
          "linkedin": "aluno@linkedin",
          "facebook": "aluno@facebook",
          "instagram": "aluno@instagram",
          "discord": "aluno@discord",
          "github": "aluno@github",
          "reddit": "aluno@reddit"
        },
        "mostrar": {
          "telefone": true, "descricao": true,
          "email": true, "linkedin": true, "facebook": true,
          "instagram": true, "discord": true, "github": true, "reddit": true
        }
      }`);
      return EndpointUtils.endpointHandler<PerfilResponseData, PerfilResponse, PerfilErrorResponse>(
        EndpointUtils.mockEndpoint(response)
      );
    } // TODO: (Perfil) Remover mock

    return EndpointUtils.endpointHandler<PerfilResponseData, PerfilResponse, PerfilErrorResponse>(
      this.http.get<PerfilResponseData>(
        this.editPerfilEndpoint
      )
    );
  }

}

// Backend response model
export interface PerfilOkResponse {
  response: "OK";
}
// Backend response model
export interface PerfilResponse {
  uuid: string;
  nome: string;
  curso: string;
  polo: string;
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
  },
  mostrar: {
    telefone: boolean, descricao: boolean,
    email: boolean, linkedin: boolean, facebook: boolean, instagram: boolean, discord: boolean, github: boolean, reddit: boolean
  }
}
export interface PerfilErrorResponse extends ErrorResponse {}
export type PerfilResponseData = PerfilOkResponse | PerfilResponse | PerfilErrorResponse;

