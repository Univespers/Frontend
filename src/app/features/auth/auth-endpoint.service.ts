import { Injectable } from '@angular/core';
import { from, map, Observable, of, tap } from 'rxjs';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { FirebaseApp } from '@angular/fire/app';
import { doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';

import { CurrentStatus } from 'src/app/current-status';
import { AuthType } from './auth.model';
import { AuthDataModel, AuthDoc } from '../endpoint.model';

@Injectable({
  providedIn: 'root'
})
export class AuthEndpointService {

  private static DEFAULT_USER_AUTH_TYPE = AuthType.Estudante;

  constructor(
    private fireApp: FirebaseApp,
    private fireStore: Firestore
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
      tap(userUID => this.setAuthType(userUID, AuthEndpointService.DEFAULT_USER_AUTH_TYPE))
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
  public setAuthType(userUID: string, type: AuthType) {
    if(!userUID) return;
    if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_ENDPOINT] SetAuthType: DOING");
    setDoc(doc(this.fireStore, AuthDataModel.authDoc.collection, userUID), 
      AuthDataModel.authDoc.getContent(type))
      .then(() => {
        if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_ENDPOINT] SetAuthType: DONE");
      })
      .catch((error) => {
        if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_ENDPOINT] SetAuthType: ERROR");
        if(CurrentStatus.DEBUG_MODE) console.log(error);
      });
    return;
  }
  public getAuthType(userUID: string): Observable<AuthType> {
    if(CurrentStatus.MOCK.AUTH) {
      if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_ENDPOINT] MOCK GetAuthType");
      return of(AuthType.Estudante);
    }

    if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_ENDPOINT] GetAuthType: DOING");
    return from(
      getDoc(doc(this.fireStore, AuthDataModel.authDoc.collection, userUID))
        .then((data) => {
          if(!data.exists) return AuthType.Visitante;
          const authType = (<AuthDoc>data.data()).tipo;
          if(!authType) return AuthType.Visitante;
          if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_ENDPOINT] GetAuthType: DONE");
          if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_ENDPOINT] User auth type: " + authType);
          return authType;
        })
        .catch((error) => {
          if(CurrentStatus.DEBUG_MODE) console.log("[AUTH_ENDPOINT] GetAuthType: ERROR");
          if(CurrentStatus.DEBUG_MODE) console.log(error);
        })
    ).pipe(
      map((data) => (data ? data : AuthType.Visitante)) // Sempre retorna um AuthType
    );
  }

}