import { ShellModel } from '../../shell/data-store';

export class FirebaseListingItemModel extends ShellModel {
    image: string;
    name: string;
    birthdate: number; // timestamp
    lastname: string;
    age: number;
    id: string;
    mediaTotal: number;
    statusJogador: number;
    phone: number;
    skills: Array<any> = [
        '',
        '',
        ''
    ];
    createdAt: any; //data de criação
    meses: {};
    mediaSemana: number;
    mediaMes: number;
    idMedia: Array<any> = [];
    statusMedia: boolean;
    tipoUser: string;
    skillsMedia: Array<any> = [];
   
    constructor() {
        super();
    }
}
