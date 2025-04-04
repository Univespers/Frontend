export class Auth {

  constructor(
    public id: string,
    public type: AuthType,
    private _token: string,
    public tokenExpiration: Date
  ) {}

  get token() {
    const now = new Date();
    if(this.tokenExpiration && this.tokenExpiration > now) {
      return this._token;
    }
    return null;
  }

}

export enum AuthType {
  Guest = "GUEST", Student = "STUDENT", Admin = "ADMIN"
}
