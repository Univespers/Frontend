import { Colleague } from "./colleague.model";

export class ColleagueList {

    constructor(
        public list: Colleague[] = []
    ) {}

    get total() {
        return 8; // Total = 8
    }

}
