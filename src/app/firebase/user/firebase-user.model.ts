import { ShellModel } from '../../shell/data-store';

export class FirebaseSkillModel extends ShellModel {
    id: string;
    name: string;

    constructor() {
        super();
    }
}

export class FirebaseUserModel extends ShellModel {
    id: string;
    avatar: string;
    name: string;
    lastname: string;
    phone: number;
    age?: number;
    birthdate: number; // timestamp
    skills: Array<any> = [
        '',
        '',
        ''
    ];
    createdAt: any; //data de criação
    statusJogador: number;
    meses: {};
    mediaSemana: number;
    mediaMes: number;
    idMedia: Array<any> = [];
    tipoUser: boolean;
    skillsMedia: [
        { nome: string, valor: number },
        { nome: string, valor: number },
        { nome: string, valor: number },
        { nome: string, valor: number },
        { nome: string, valor: number },
        { nome: string, valor: number },
    ];

    constructor() {
        super();
    }

}
export class FirebaseCombinedUserModel extends FirebaseUserModel {
    skills: Array<FirebaseSkillModel> = [
        new FirebaseSkillModel(),
        new FirebaseSkillModel(),
        new FirebaseSkillModel()
    ];

    constructor() {
        super();
    }
}
