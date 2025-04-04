import { afterNextRender, EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { Auth, AuthType } from './auth.model';
import { AuthEndpointService, AuthOkResponse, AuthResponseData } from 'src/app/endpoints/auth-endpoint.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public auth?: Auth;

  private static _LOCAL_AUTH_DATA_NAME = "authorization";
  private _logoutTimer: NodeJS.Timeout | null = null;
  private _localStorage?: Storage;

  constructor(
    private authEndpointService: AuthEndpointService,
    private router: Router
  ) {
    afterNextRender(() => {
      this._localStorage = localStorage; // "localStorage" is a browser thing. SSR doesn't have that
    });
  }

  // Auth types
  public isUserStudent() {
    return (this.auth?.type == AuthType.Student);
  }
  public isUserGuest() {
    return (this.auth?.type == AuthType.Guest || !this.auth?.type);
  }

  // Signin
  public registerUser(email: string, password: string): Observable<AuthOkResponse> {
    return this.authEndpointService.registerUser(email, password).pipe(
      tap(authData => this._loadAuth(authData))
    );
  }

  // Login
  public loginUser(email: string, password: string): Observable<AuthOkResponse> {
    return this.authEndpointService.loginUser(email, password).pipe(
      tap(authData => this._loadAuth(authData))
    );
  }

  // AutoLogin when page reloads
  public autoLogin() {
    const auth = this._getAuthLocally();
    if(!auth?.token) return;
    this.auth = auth;
    const expiresIn = +auth.tokenExpiration - new Date().getTime();
    this._setAutoLogout(expiresIn);
    this.router.navigate([ "/colegas" ]);
  }

  // Logout
  public logout() {
    this._removeAuthLocally();
    this._resetAutoLogout();
    this.router.navigate([ "/logout" ]);
    // TODO: (Auth) Informar backend de um logout!
  }

  // Loads auth
  private _loadAuth(authData: AuthOkResponse) {
    const expiresIn = +authData.expiresIn;
    const expirationDate = new Date(new Date().getTime() + expiresIn);
    this.auth = new Auth(authData.authId, authData.authType, authData.token, expirationDate);
    this._storeAuthLocally(this.auth);
    this._setAutoLogout(expiresIn);
  }

  // Manages auth in the local browser storage
  private _storeAuthLocally(auth: Auth) {
    this._localStorage?.setItem(AuthService._LOCAL_AUTH_DATA_NAME, JSON.stringify(auth));
  }
  private _getAuthLocally(): Auth | null {
    const authData = this._localStorage?.getItem(AuthService._LOCAL_AUTH_DATA_NAME);
    if(!authData) return null;
    const protoAuth = JSON.parse(authData); // It does not contain functions!
    return new Auth(protoAuth.id, protoAuth.type, protoAuth._token, new Date(protoAuth.tokenExpiration));
  }
  private _removeAuthLocally() {
    this._localStorage?.removeItem(AuthService._LOCAL_AUTH_DATA_NAME);
  }

  // AutoLogout when token expires
  private _setAutoLogout(expiration: number) {
    if(expiration <= 0) {
      this.logout();
    } else {
      this._resetAutoLogout();
      this._logoutTimer = setTimeout(() => {
        this.logout();
      }, expiration)
    }
  }
  private _resetAutoLogout(){
    if(this._logoutTimer) {
      clearTimeout(this._logoutTimer);
      this._logoutTimer = null;
    }
  }

}