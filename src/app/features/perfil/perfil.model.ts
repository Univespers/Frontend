import { PerfilResponse } from "src/app/features/perfil/perfil-endpoint.service";

export class Perfil {

    constructor(
        public uid: string,
        public name: string,
        public course: string,
        public pole: string,
        public studentEmail: string,
        public telephone?: string,
        public isWhatsapp?: boolean,
        public description?: string,
        public contacts?: {
            email?: string,
            linkedin?: string,
            facebook?: string,
            instagram?: string,
            discord?: string,
            github?: string,
            reddit?: string
        },
        public mostrar?: {
          telefone?: boolean, descricao?: boolean,
          email?: boolean, linkedin?: boolean, facebook?: boolean, instagram?: boolean, discord?: boolean, github?: boolean, reddit?: boolean
        }
    ) {}

    // Converts perfil
    public static getPerfil(perfilData: PerfilResponse) {
        return new Perfil(
            perfilData.uid,
            perfilData.nome,
            perfilData.emailInstitucional,
            perfilData.curso,
            perfilData.polo,
            perfilData.telefone,
            perfilData.temWhatsapp,
            perfilData.descricao,
            perfilData.contatos
        );
    }

}
