import { ColleagueDetailsResponse, ColleagueListResponse, ColleagueResponse } from "src/app/endpoints/colleague-endpoint.service";

export class Colleague {
    constructor(
        public name: string,
        public course: string,
        public pole: string,
    ) {}

    // Converts colleague
    public static getColleague(colleagueData: ColleagueResponse) {
        return new Colleague(colleagueData.nome, colleagueData.curso, colleagueData.polo);
    }

    // Converts list of colleagues
    public static getColleagueList(colleagueData: ColleagueListResponse) {
        return colleagueData.lista.map(colleague => {
            return new Colleague(colleague.nome, colleague.curso, colleague.polo);
        });
    }

}

export class ColleagueDetails extends Colleague {
    constructor(
        name: string,
        public studentEmail: string,
        course: string,
        pole: string,
        public telephone?: string,
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
        super(name, course, pole);
    }

    // Converts colleague details
    public static getColleagueDetails(colleagueDetailsData: ColleagueDetailsResponse) {
        return new ColleagueDetails(
            colleagueDetailsData.nome,
            colleagueDetailsData.emailInstitucional,
            colleagueDetailsData.curso,
            colleagueDetailsData.polo,
            colleagueDetailsData.telefone,
            colleagueDetailsData.descricao,
            colleagueDetailsData.contatos
        );
    }
}
