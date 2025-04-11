import { AuthOkResponse } from "src/app/endpoints/auth-endpoint.service";

export class Auth {

  constructor(
    public type: AuthType,
    private _token?: string,
    public tokenExpiration?: Date
  ) {}

  get token() {
    const now = new Date();
    if(!this.tokenExpiration || this.tokenExpiration > now) {
      return this._token;
    }
    return null;
  }

  // Converts auth
  public static getAuth(authData: AuthOkResponse) {
    const expiresIn = +authData.validade;
    const expirationDate = new Date(new Date().getTime() + expiresIn);
    return new Auth(authData.tipo, authData.token, expirationDate);
  }

}

export enum AuthType {
  Guest = "GUEST", Student = "STUDENT", Admin = "ADMIN"
}
