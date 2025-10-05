export class Auth {

  constructor(
    public type: AuthType,
    public userUID: string
  ) {}

  public static getAuth(authType: AuthType, userUID: string) {
    return new Auth(authType, userUID);
  }

}

export enum AuthType {
  Visitante = "VISITANTE", Estudante = "ESTUDANTE", Admin = "ADMINISTRADOR"
}
