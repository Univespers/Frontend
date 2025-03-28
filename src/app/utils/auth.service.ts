import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {

  }
  isUserStudent() {
    return false;
  }
  isUserGuest() {
    return true;
  }
}
