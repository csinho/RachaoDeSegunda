import { Component, OnInit, HostBinding, Input } from '@angular/core';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

import { FirebaseService } from '../../firebase-integration.service';
import { FirebaseCombinedUserModel } from '../firebase-user.model';
import { FirebaseListingItemModel } from '../../listing/firebase-listing.model';
import { FirebaseUpdateUserModal } from '../update/firebase-update-user.modal';

import { DataStore, ShellModel } from '../../../shell/data-store';
import { MediaComponent } from '../media/media.component';
import { ConfimationPage } from '../confimation/confimation.page';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'app-firebase-user-details',
    templateUrl: './firebase-user-details.page.html',
    styleUrls: [
        './styles/firebase-user-details.page.scss',
        './styles/firebase-user-details.shell.scss'
    ],
})
export class FirebaseUserDetailsPage implements OnInit {
    user: FirebaseCombinedUserModel;

    @Input() rating_campo: number;
    @Input() rating_individual: number;


    public media = 0;
    public profileUser: any;
    public admUser: any;
    public confirmaMedia = false;


    // Use Typescript intersection types to enable docorating the Array of firebase models with a shell model
    // (ref: https://www.typescriptlang.org/docs/handbook/advanced-types.html#intersection-types)
    relatedUsers: Array<FirebaseListingItemModel> & ShellModel;

    @HostBinding('class.is-shell') get isShell() {
        return ((this.user && this.user.isShell) || (this.relatedUsers && this.relatedUsers.isShell)) ? true : false;
    }

    constructor(
        public firebaseService: FirebaseService,
        public modalController: ModalController,
        public router: Router,
        private route: ActivatedRoute,
        public dadosUser: ConfimationPage,
        public alertController: AlertController,
        public loadingController: LoadingController,             
        private storage: Storage
    ) {

    }

    ngOnInit() {

        this.storage.get('info_user').then((val) => { 
            this.profileUser = val.id; 
            this.admUser = val.tipoUser
        });


        this.route.data.subscribe((resolvedRouteData) => {
            const resolvedDataStores = resolvedRouteData['data'];
            const combinedDataStore: DataStore<FirebaseCombinedUserModel> = resolvedDataStores.user;
            const relatedUsersDataStore: DataStore<Array<FirebaseListingItemModel>> = resolvedDataStores.relatedUsers;

            combinedDataStore.state.subscribe(
                (state) => {
                    this.user = state;
                    var data = new Date();
                    var diaSemana = data.getDay()
                    var hora_atual = data.getHours() + ":" + data.getMinutes()

                    if (diaSemana === 1 || diaSemana === 1 && hora_atual === "22:00" ||
                        diaSemana === 2 || diaSemana === 3) {
                        this.confirmaMedia = true;

                        this.user.idMedia.forEach(id => {
                            if (id === this.profileUser) {
                                this.confirmaMedia = false;
                            }
                        });
                    }
                    this.storage.set('info_users', this.user);
                }
            );
            relatedUsersDataStore.state.subscribe(
                (state) => {
                    this.relatedUsers = state;
                }
            );
        });
    }

    async open() {

        if (this.user.idMedia.length === 0 || this.user.idMedia.length > 0) {

            const modal = await this.modalController.create({
                component: MediaComponent,
                componentProps: {
                    'user': this.user
                },
                cssClass: 'my-custom-modal-css'
            });
            await modal.present();
        }
    }

    async openFirebaseUpdateModal() {
        const modal = await this.modalController.create({
            component: FirebaseUpdateUserModal,
            componentProps: {
                'user': this.user
            }
        });

        await modal.present();
    }
}