import { Component } from '@angular/core';
import { FirebaseService } from '../firebase-integration.service';
import { ModalController, NavParams } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'app-mod-user',
    templateUrl: './mod-user.component.html',
    styleUrls: ['./mod-user.component.scss'],
})
export class ModUserComponent {

    user: any;

    constructor(
        public firebaseService: FirebaseService,
        public modalController: ModalController,
        public router: Router,
        private navParams: NavParams,
        private storage: Storage
    ) {
        this.user = this.navParams.get('user');
    }

    closeModal() {
        this.modalController.dismiss();
    }

    abrirHome() {
        this.storage.set('info_user', this.user);
        this.router.navigate(['app/home']);
        this.modalController.dismiss();
    }

}
