import { afterNextRender, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

import { Auth, AuthType } from './auth.model';
import { AuthEndpointService, AuthOkResponse } from 'src/app/endpoints/auth-endpoint.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public auth: Auth = new Auth(AuthType.Guest);

  private static _LOCAL_AUTH_DATA_NAME = "authorization";
  private _logoutTimer: NodeJS.Timeout | null = null;
  private _localStorage = new BehaviorSubject<Storage | null>(null);

  constructor(
    private authEndpointService: AuthEndpointService,
    private router: Router
  ) {
    afterNextRender(() => {
      this._localStorage.next(localStorage); // "localStorage" is a browser thing. SSR doesn't have that
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
    return this.authEndpointService.registerUser(email, password);
  }

  // Login
  public loginUser(email: string, password: string): Observable<Auth> {
    return this.authEndpointService.loginUser(email, password).pipe(
      map(data => Auth.getAuth(data)),
      tap(data => this._loadAuth(data))
    );
  }

  // AutoLogin when page reloads
  public autoLogin(): Observable<Auth> {
    return this._getAuthLocally().pipe(
      tap(auth => {
        this.auth = auth;
        if(!auth?.token || !auth?.tokenExpiration) return;
        const expiresIn = +auth.tokenExpiration - new Date().getTime();
        this._setAutoLogout(expiresIn);
      })
    );
  }

  // Logout
  public logout() {
    this._removeAuthLocally();
    this._resetAutoLogout();
    this.router.navigate([ "/logout" ]);
    // TODO: (Auth) Informar backend de um logout!
  }

  // Loads auth
  private _loadAuth(auth: Auth) {
    this.auth = auth;
    this._storeAuthLocally(this.auth);
    const currentTime = new Date().getTime();
    const expiresIn = (this.auth.tokenExpiration?.getTime() ?? currentTime) - currentTime;
    this._setAutoLogout(expiresIn);
  }

  // Manages auth in the local browser storage
  private _storeAuthLocally(auth: Auth) {
    this._localStorage.subscribe(localStorage => {
      localStorage?.setItem(AuthService._LOCAL_AUTH_DATA_NAME, JSON.stringify(auth));
    });
  }
  private _getAuthLocally(): Observable<Auth> {
    return this._localStorage.pipe(
      map(localStorage => {
        const authData = localStorage?.getItem(AuthService._LOCAL_AUTH_DATA_NAME);
        if(!authData) return new Auth(AuthType.Guest, "", new Date());
        const protoAuth = JSON.parse(authData); // It does not contain functions!
        return new Auth(protoAuth.type, protoAuth._token, new Date(protoAuth.tokenExpiration));
      })
    );
  }
  private _removeAuthLocally() {
    this._localStorage.subscribe(localStorage => {
      localStorage?.removeItem(AuthService._LOCAL_AUTH_DATA_NAME);
    });
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