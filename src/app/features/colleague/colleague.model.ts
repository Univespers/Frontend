import { ColleagueDetailsResponse, ColleagueListResponse, ColleagueResponse } from "./colleague-endpoint.service";

export class Colleague {
    constructor(
        public uuid: string,
        public name: string,
        public course: string,
        public pole: string,
    ) {}

    // Converts colleague
    public static getColleague(colleagueData: ColleagueResponse) {
        return new Colleague(colleagueData.uuid, colleagueData.nome, colleagueData.curso, colleagueData.polo);
    }
}

export class ColleagueList {
    constructor(
        public list: Colleague[],
        public page: number,
        public totalPages: number
    ) {}

    // Converts list of colleagues
    public static getColleagueList(colleagueData: ColleagueListResponse) {
        return new ColleagueList(
            colleagueData.lista.map(colleague => {
                return new Colleague(colleague.uuid, colleague.nome, colleague.curso, colleague.polo);
            }),
            colleagueData.pagina,
            colleagueData.totalPaginas
        );
    }
}

export class ColleagueDetails extends Colleague {
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

    // Converts colleague details
    public static getColleagueDetails(colleagueDetailsData: ColleagueDetailsResponse) {
        return new ColleagueDetails(
            colleagueDetailsData.uuid,
            colleagueDetailsData.nome,
            colleagueDetailsData.emailInstitucional,
            colleagueDetailsData.curso,
            colleagueDetailsData.polo,
            colleagueDetailsData.telefone,
            colleagueDetailsData.temWhatsapp,
            colleagueDetailsData.descricao,
            colleagueDetailsData.contatos
        );
    }
}
