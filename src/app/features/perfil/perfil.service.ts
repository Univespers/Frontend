import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { Perfil } from './perfil.model';
import { PerfilEndpointService, PerfilOkResponse } from 'src/app/features/perfil/perfil-endpoint.service';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  constructor(
      private perfilEndpointService: PerfilEndpointService,
  ) {}

  // New Perfil
  public createPerfil(name: string, studentEmail: string, course: string, pole: string): Observable<PerfilOkResponse> {
    return this.perfilEndpointService.createPerfil(name, studentEmail, course, pole);
  }

  // New Perfil
  public editPerfil(
    name: string, studentEmail: string, telephone: string, isWhatsapp: boolean, description: string,
    showTelephone: boolean, showDescription: boolean,
    courseName: string, poleName: string, currentSemester: number, interests: string[], skills: string[], subjects: string[],
    email: string, linkedin: string, facebook: string, instagram: string, discord: string, github: string, reddit: string,
    showPersonalEmail: boolean, showLinkedIn: boolean, showFacebook: boolean, showInstagram: boolean, showDiscord: boolean, showGitHub: boolean, showReddit: boolean
  ): Observable<PerfilOkResponse> {
    return this.perfilEndpointService.editPerfil(
      name, studentEmail, telephone, isWhatsapp, description, courseName, poleName,
      showTelephone, showDescription,
      currentSemester, interests, skills, subjects,
      email, linkedin, facebook, instagram, discord, github, reddit,
      showPersonalEmail, showLinkedIn, showFacebook, showInstagram, showDiscord, showGitHub, showReddit);
  }

  // Get Student
  public getPerfil(): Observable<Perfil> {
    return this.perfilEndpointService.getPerfil().pipe(
      map(data => Perfil.getPerfil(data))
    );
  }

}
