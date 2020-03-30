import { Component } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from '../../firebase-integration.service';

@Component({
    selector: 'app-confimation',
    templateUrl: './confimation.page.html',
    styleUrls: ['./confimation.page.scss'],
})
export class ConfimationPage {

    user: any;
    //public dadosUser: {};

    constructor(
        public firebaseService: FirebaseService,
        public modalController: ModalController,
        public router: Router,
        private route: ActivatedRoute,
    ) {

        this.route.queryParams.subscribe(params => {
            let getNav = this.router.getCurrentNavigation();
            if (getNav.extras.state) {
                this.user = getNav.extras.state.valorParaEnviar;
            }
        });

    }

    closeModal() {
        this.router.navigate(['/getting-started']);
    }

    abrir() {
        let navigationExtras: NavigationExtras = {
            state: {
                valorParaEnviar: this.user
            }
        }; 
        this.modalController.dismiss();
        this.router.navigate(['app/home'], navigationExtras);
    }

}
