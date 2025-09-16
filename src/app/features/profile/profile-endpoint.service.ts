import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { EndpointUtils, ErrorResponse } from '../endpoint-utils';

@Injectable({
  providedIn: 'root'
})
export class ProfileEndpointService {

  private mock = true; // TODO: (Profile) Remover mocks

  private apiEndpoint = "http://localhost:3000/api"; // TODO: (Profile) Endpoint
  private profileEndpoint = `${this.apiEndpoint}/estudante`;
  private createProfileEndpoint = `${this.profileEndpoint}/novo`;
  private editProfileEndpoint = `${this.profileEndpoint}/editar`;

  constructor(
    private http: HttpClient
  ) {}

  // New Profile
  public createProfile(name: string, studentEmail: string, course: string, pole: string): Observable<ProfileOkResponse> {

    console.log("CREATE_PROFILE");
    
    if(this.mock) {
      const response = JSON.parse(`{
        "response": "OK"
      }`);
      return EndpointUtils.endpointHandler<ProfileResponseData, ProfileOkResponse, ProfileErrorResponse>(
        EndpointUtils.mockEndpoint(response)
      );
    } // TODO: (Profile) Remover mock

    return EndpointUtils.endpointHandler<ProfileResponseData, ProfileOkResponse, ProfileErrorResponse>(
      this.http.post<ProfileResponseData>(
        this.createProfileEndpoint,
        {
          nome: name,
          emailInstitucional: studentEmail,
          curso: course,
          polo: pole
        }
      )
    );
  }

  // Edit Profile
  public editProfile(
    name: string, studentEmail: string, telephone: string, isWhatsapp: boolean, description: string, courseName: string, poleName: string,
    showTelephone: boolean, showDescription: boolean,
    currentSemester: number, interests: string[], skills: string[], subjects: string[],
    email: string, linkedin: string, facebook: string, instagram: string, discord: string, github: string, reddit: string,
    showPersonalEmail: boolean, showLinkedIn: boolean, showFacebook: boolean, showInstagram: boolean, showDiscord: boolean, showGitHub: boolean, showReddit: boolean
  ): Observable<ProfileOkResponse> {

    if(this.mock) {
      const response = JSON.parse(`{
        "response": "OK"
      }`);
      return EndpointUtils.endpointHandler<ProfileResponseData, ProfileOkResponse, ProfileErrorResponse>(
        EndpointUtils.mockEndpoint(response)
      );
    } // TODO: (Profile) Remover mock

    return EndpointUtils.endpointHandler<ProfileResponseData, ProfileOkResponse, ProfileErrorResponse>(
      this.http.post<ProfileResponseData>(
        this.editProfileEndpoint,
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

  // Get Profile
  public getProfile(): Observable<ProfileResponse> {

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
      return EndpointUtils.endpointHandler<ProfileResponseData, ProfileResponse, ProfileErrorResponse>(
        EndpointUtils.mockEndpoint(response)
      );
    } // TODO: (Profile) Remover mock

    return EndpointUtils.endpointHandler<ProfileResponseData, ProfileResponse, ProfileErrorResponse>(
      this.http.get<ProfileResponseData>(
        this.editProfileEndpoint
      )
    );
  }

}

// Backend response model
export interface ProfileOkResponse {
  response: "OK";
}
// Backend response model
export interface ProfileResponse {
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
export interface ProfileErrorResponse extends ErrorResponse {}
export type ProfileResponseData = ProfileOkResponse | ProfileResponse | ProfileErrorResponse;

