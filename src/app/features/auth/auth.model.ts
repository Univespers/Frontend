export class Auth {

  constructor(
    public type: AuthType
  ) {}

  public static getAuth(authType: AuthType) {
    return new Auth(authType);
  }

}

export enum AuthType {
  Visitante = "VISITANTE", Estudante = "ESTUDANTE", Admin = "ADMINISTRADOR"
}
