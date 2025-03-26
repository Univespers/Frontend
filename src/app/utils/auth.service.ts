import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {

  }
  isUserStudent() {
    return true;
  }
  isUserGuest() {
    return false;
  }
}
