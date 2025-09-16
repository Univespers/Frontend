import { ColegaDetailsResponse, ColegaListResponse, ColegaResponse } from "./colegas-endpoint.service";

export class Colega {
    constructor(
        public uuid: string,
        public name: string,
        public course: string,
        public pole: string,
    ) {}

    // Converts colega
    public static getColega(colegaData: ColegaResponse) {
        return new Colega(colegaData.uuid, colegaData.nome, colegaData.curso, colegaData.polo);
    }
}

export class ColegaList {
    constructor(
        public list: Colega[],
        public page: number,
        public totalPages: number
    ) {}

    // Converts list of colegas
    public static getColegaList(colegaData: ColegaListResponse) {
        return new ColegaList(
            colegaData.lista.map(colega => {
                return new Colega(colega.uuid, colega.nome, colega.curso, colega.polo);
            }),
            colegaData.pagina,
            colegaData.totalPaginas
        );
    }
}

export class ColegaDetails extends Colega {
    constructor(
        uuid: string,
        name: string,
        public studentEmail: string,
        course: string,
        pole: string,
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
        }
    ) {
        super(uuid, name, course, pole);
    }

    // Converts colega details
    public static getColegaDetails(colegaDetailsData: ColegaDetailsResponse) {
        return new ColegaDetails(
            colegaDetailsData.uuid,
            colegaDetailsData.nome,
            colegaDetailsData.emailInstitucional,
            colegaDetailsData.curso,
            colegaDetailsData.polo,
            colegaDetailsData.telefone,
            colegaDetailsData.temWhatsapp,
            colegaDetailsData.descricao,
            colegaDetailsData.contatos
        );
    }
}
