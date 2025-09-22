import { ColegaContatoResponse, ColegaDetailsResponse, ColegaListResponse, ColegaResponse } from "./colegas-endpoint.service";

export class Colega {
    constructor(
        public uid: string,
        public name: string,
        public course: string,
        public pole: string,
    ) {}

    // Converts colega
    public static getColega(colegaData: ColegaResponse) {
        return new Colega(colegaData.uid, colegaData.nome, colegaData.curso, colegaData.polo);
    }
}

export class ColegaList {
    constructor(
        public list: Colega[],
        public indexUID: string,
        public totalPages: number,
        public isLastPage: boolean
    ) {}

    // Converts list of colegas
    public static getColegaList(colegaData: ColegaListResponse) {
        return new ColegaList(
            colegaData.colegasList.map(colega => Colega.getColega(colega)),
            colegaData.indexUID,
            colegaData.totalPages,
            colegaData.isLastPage
        );
    }
}

export class ColegaContato {
    constructor(
        public name: string,
        public url: string
    ) {}

    // Converts contato
    public static getContato(colegaData: ColegaContatoResponse) {
        return new ColegaContato(colegaData.nome, colegaData.url);
    }
}
export class ColegaDetails extends Colega {
    constructor(
        uid: string,
        name: string,
        public studentEmail: string,
        course: string,
        pole: string,
        public telephone?: string,
        public isWhatsapp?: boolean,
        public description?: string,
        public contacts?: ColegaContato[]
    ) {
        super(uid, name, course, pole);
    }

    // Converts colega details
    public static getColegaDetails(colegaDetailsData: ColegaDetailsResponse) {
        return new ColegaDetails(
            colegaDetailsData.uid,
            colegaDetailsData.nome,
            colegaDetailsData.emailInstitucional,
            colegaDetailsData.cursoUID,
            colegaDetailsData.poloUID,
            colegaDetailsData.telefone,
            colegaDetailsData.temWhatsapp,
            colegaDetailsData.descricao,
            colegaDetailsData.contatos?.map(contato => ColegaContato.getContato(contato))
        );
    }
}
