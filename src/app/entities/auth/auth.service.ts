import { Injectable } from '@angular/core';

import { AuthType } from './auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {}

  // User type
  private _authType: AuthType = AuthType.Guest;

  setAuthType(type: AuthType) {
    this._authType = type
  }
  isUserStudent() {
    return (this._authType == AuthType.Student);
  }
  isUserGuest() {
    return (this._authType == AuthType.Guest);
  }

}