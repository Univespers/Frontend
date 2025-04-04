export class Colleague {

    constructor(
        public name: string,
        public studentEmail: string,
        public course: string,
        public pole: string,
        public currentSemester?: string,
        public interests?: string[],
        public skills?: string[],
        public currentSubjects?: string[],
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
    ) {}

}
