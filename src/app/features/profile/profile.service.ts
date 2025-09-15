import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { Profile } from './profile.model';
import { ProfileEndpointService, ProfileOkResponse } from 'src/app/features/profile/profile-endpoint.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
      private profileEndpointService: ProfileEndpointService,
  ) {}

  // New Profile
  public createProfile(name: string, studentEmail: string, course: string, pole: string): Observable<ProfileOkResponse> {
    return this.profileEndpointService.createProfile(name, studentEmail, course, pole);
  }

  // New Profile
  public editProfile(
    name: string, studentEmail: string, telephone: string, isWhatsapp: boolean, description: string,
    showTelephone: boolean, showDescription: boolean,
    courseName: string, poleName: string, currentSemester: number, interests: string[], skills: string[], subjects: string[],
    email: string, linkedin: string, facebook: string, instagram: string, discord: string, github: string, reddit: string,
    showPersonalEmail: boolean, showLinkedIn: boolean, showFacebook: boolean, showInstagram: boolean, showDiscord: boolean, showGitHub: boolean, showReddit: boolean
  ): Observable<ProfileOkResponse> {
    return this.profileEndpointService.editProfile(
      name, studentEmail, telephone, isWhatsapp, description, courseName, poleName,
      showTelephone, showDescription,
      currentSemester, interests, skills, subjects,
      email, linkedin, facebook, instagram, discord, github, reddit,
      showPersonalEmail, showLinkedIn, showFacebook, showInstagram, showDiscord, showGitHub, showReddit);
  }

  // Get Student
  public getProfile(): Observable<Profile> {
    return this.profileEndpointService.getProfile().pipe(
      map(data => Profile.getProfile(data))
    );
  }

}
