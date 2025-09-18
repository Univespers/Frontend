import { Injectable } from '@angular/core';
import { from, map, Observable, of, switchMap, tap } from 'rxjs';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { FirebaseApp } from '@angular/fire/app';
import { get, getDatabase, ref, set } from '@angular/fire/database';

import { CurrentStatus } from 'src/app/current-status';

@Injectable({
  providedIn: 'root'
})
export class AuthEndpointService {

  private static AUTH_ENDPOINT = ((userUID: string) => `auth/${userUID}/tipo`);
  private static DEFAULT_USER_AUTH_TYPE = "ESTUDANTE";

  constructor(
    private fireApp: FirebaseApp
  ) {}

  // Cadastro
  public cadastro(email: string, password: string): Observable<string> { // Retorna user UID
    if(CurrentStatus.MOCK.AUTH) {
      if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_ENDPOINT] MOCK Cadastro");
      return of("randomUserUID");
    }

    if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_ENDPOINT] Cadastro: DOING");
    return from(
      // Firebase create user
      createUserWithEmailAndPassword(getAuth(this.fireApp), email, password)
        .then((userCredential) => {
          const userUID = userCredential.user.uid;
          if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_ENDPOINT] Cadastro: DONE");
          if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_ENDPOINT] User UID: " + userUID);
          return userUID;
        })
        .catch((error) => {
          if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_ENDPOINT] Cadastro: ERROR");
          if(CurrentStatus.DEBUG_MODE) console.log(error);
        })
    ).pipe(
      map(data => (!data ? "" : data)), // Retorna sempre string
      tap(userUID => {
        if(!userUID) return "";
        return set(ref(getDatabase(this.fireApp), AuthEndpointService.AUTH_ENDPOINT(userUID)), AuthEndpointService.DEFAULT_USER_AUTH_TYPE)
          .then(() => {
            if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_ENDPOINT] SetAuthType: DONE");
          })
          .catch((error) => {
            if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_ENDPOINT] SetAuthType: ERROR");
            if(CurrentStatus.DEBUG_MODE) console.log(error);
          });
      })
    );
  }

  // Login
  public login(email: string, password: string): Observable<string> { // Retorna user UID
    if(CurrentStatus.MOCK.AUTH) {
      if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_ENDPOINT] MOCK Login");
      return of("randomUserUID");
    }

    if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_ENDPOINT] Login: DOING");
    return from(
      // Firebase login
      signInWithEmailAndPassword(getAuth(this.fireApp), email, password)
        .then((userCredential) => {
          const userUID = userCredential.user.uid;
          if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_ENDPOINT] Login: DONE");
          if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_ENDPOINT] User UID: " + userUID);
          return userUID;
        })
        .catch((error) => {
          if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_ENDPOINT] Login: ERROR");
          if(CurrentStatus.DEBUG_MODE) console.log(error);
        })
    ).pipe(
      map(data => (!data ? "" : data)) // Retorna sempre string
    );
  }

  // Login Manager
  public loginManager(): Observable<string | boolean> { // Retorna user UID ou false
    if(CurrentStatus.MOCK.AUTH) {
      if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_ENDPOINT] MOCK LoginManager");
      return of(false); // Tudo deve começar na página de Login
    }

    if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_ENDPOINT] LoginManager: DOING");
    return new Observable((subscriber) => {
      onAuthStateChanged(getAuth(this.fireApp), (user) => {
        if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_ENDPOINT] User auth got an update");
        if(user && user.uid) {
          if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_ENDPOINT] LoginManager: DONE");
          if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_ENDPOINT] User UID: " + user.uid);
          subscriber.next(user.uid);
          subscriber.complete();
        } else {
          if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_ENDPOINT] LoginManager: NOT DONE");
          subscriber.next(false);
          subscriber.complete();
        }
      });
    });
  }

  // Logout
  public logout(): Observable<boolean> {
    if(CurrentStatus.MOCK.AUTH) {
      if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_ENDPOINT] MOCK Logout");
      return of(true);
    }

    if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_ENDPOINT] Logout: DOING");
    return from(
      // Firebase logout
      signOut(getAuth(this.fireApp))
        .then(() => {
          if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_ENDPOINT] Logout: DONE");
          return true;
        })
        .catch((error) => {
          if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_ENDPOINT] Logout: ERROR");
          if(CurrentStatus.DEBUG_MODE) console.log(error);
        })
    ).pipe(
      map(data => true) // Retorna sempre boolean
    );
  }

  // AuthType
  public getAuthType(userUID: string): Observable<string> {
    if(CurrentStatus.MOCK.AUTH) {
      if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_ENDPOINT] MOCK GetAuthType");
      return of("ESTUDANTE");
    }
    if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_ENDPOINT] GetAuthType: DOING");
    return new Observable<string>((subscriber) => {
      get(ref(getDatabase(this.fireApp), AuthEndpointService.AUTH_ENDPOINT(userUID)))
        .then((data) => {
          const authType = data.val();
          if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_ENDPOINT] GetAuthType: DONE");
          if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_ENDPOINT] User auth type: " + authType);
          subscriber.next(authType);
          subscriber.complete();
        })
        .catch((error) => {
          if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_ENDPOINT] GetAuthType: ERROR");
          if(CurrentStatus.DEBUG_MODE) console.log(error);
          subscriber.error(error);
        });
    });
  }

}
