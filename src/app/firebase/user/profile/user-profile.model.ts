import { ShellModel } from '../../../shell/data-store';

export class FirebaseListingItemModel extends ShellModel {
    image: string;
    name: string;
    lastname: string;
    id: string;
    mediaTotal: number;
    statusJogador: number;
    phone: number;



    constructor() {
        super();
    }
}
