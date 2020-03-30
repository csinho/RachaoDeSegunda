import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
@Component({
    selector: 'app-financeiro',
    templateUrl: './financeiro.page.html',
    styleUrls: [
        './styles/financeiro.page.scss',
        './styles/financeiro.shell.scss',
    ],
})
export class FinanceiroPage implements OnInit {

    constructor(public modalController: ModalController) { }

    ngOnInit() {

       
    }

}
