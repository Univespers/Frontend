import { ProfileResponse } from "src/app/endpoints/profile-endpoint.service";

export class Profile {

    constructor(
        public uuid: string,
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

    // Converts profile
    public static getProfile(profileData: ProfileResponse) {
        return new Profile(
            profileData.uuid,
            profileData.nome,
            profileData.emailInstitucional,
            profileData.curso,
            profileData.polo,
            profileData.telefone,
            profileData.temWhatsapp,
            profileData.descricao,
            profileData.contatos
        );
    }

}
