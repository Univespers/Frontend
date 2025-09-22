import { AuthType } from "./auth/auth.model";

// Info
export interface InfoDoc {
  nome: string;
}
export class InfoDataModel {
  public static databaseDoc = {
    collection: "info"
  }
}

// Dados
export interface PoloDoc {
  uid: string;
  nome: string;
  localidade: string;
  distribuicao_regional: string;
}
export class PoloDataModel {
  public static poloDoc = {
    collection: "dados"
  }
}
export interface CursoDoc {
  uid: string;
  nome: string;
  sugerido: boolean;
}
export class CursoDataModel {
  public static cursoDoc = {
    collection: "dados"
  }
}
export interface HabilidadesDoc {
  uid: string;
  nome: string;
  sugerido: boolean;
}
export class HabilidadesDataModel {
  public static habilidadesDoc = {
    collection: "dados"
  }
}
export interface AreasDeInteresseDoc {
  uid: string;
  nome: string;
  sugerido: boolean;
}
export class AreasDeInteresseDataModel {
  public static areasDeInteresseDoc = {
    collection: "dados"
  }
}

// Auths
export interface AuthDoc {
  tipo: AuthType
}
export class AuthDataModel {
  public static authDoc = {
    collection: "auths",
    getContent: ((authType: AuthType) => {
      return <AuthDoc>{
        tipo: authType
      };
    })
  }
}

// Estudantes
export interface EstudanteDoc {
  uid: string,
  nome: string,
  curso: string,
  polo: string
}
export class EstudanteDataModel {
  public static estudanteDoc = {
    collection: "estudantes",
    getContent: ((userUID: string, nome: string, curso: string, polo: string) => {
      return <EstudanteDoc>{
        uid: userUID,
        nome: nome,
        curso: curso,
        polo: polo
      };
    })
  }
}

// Perfis
export interface PerfilDoc {
  uid: string,
  polo_uid: string,
  curso_uid: string,
  nome: string,
  email_institucional: string,
  telefone: string,
  tem_whatsapp: boolean,
  descricao: string,
  contatos: ContatoDoc[]
}
export interface ContatoDoc {
  nome: string,
  url: string
}
export class PerfilDataModel {
  public static perfilDoc = {
    collection: "perfis",
    getContent: ((
      uid: string,
      polo_uid: string,
      curso_uid: string,
      nome: string,
      email_institucional: string,
      telefone: string,
      tem_whatsapp: boolean,
      descricao: string,
      contatos: ContatoDoc[]) => {
        return <PerfilDoc>{
          uid: uid,
          polo_uid: polo_uid,
          curso_uid: curso_uid,
          nome: nome,
          email_institucional: email_institucional,
          telefone: telefone,
          tem_whatsapp: tem_whatsapp,
          descricao: descricao,
          contatos: contatos
        };
    })
  }
  public static contatoDoc = {
    collection: "contatos",
    getContent: ((nome: string, url: string) => {
      return <ContatoDoc>{
        nome: nome,
        url: url
      };
    })
  }
}

// Perfis privados
export interface PerfilPrivadoDoc {
  uid: string,
  telefone: string,
  tem_whatsapp: string,
  descricao: string,
  contatos: ContatoDoc[]
}
export interface ContatoPrivadoDoc {
  nome: string,
  url: string
}
export class PerfilPrivadoDataModel {
  public static perfilPrivDoc = {
    collection: "perfis_privados",
    getContent: ((
      uid: string,
      telefone: string,
      tem_whatsapp: string,
      descricao: string,
      contatos: ContatoPrivadoDoc[]) => {
        return <PerfilPrivadoDoc>{
          uid: uid,
          telefone: telefone,
          tem_whatsapp: tem_whatsapp,
          descricao: descricao,
          contatos: contatos
        };
    })
  }
  public static contatoPrivDoc = {
    collection: "contatos",
    getContent: ((nome: string, url: string) => {
      return <ContatoPrivadoDoc>{
        nome: nome,
        url: url
      };
    })
  }
}
