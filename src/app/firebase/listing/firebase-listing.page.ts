import { Component, OnInit, OnDestroy, HostBinding, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { Observable, ReplaySubject, Subscription, merge } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { FirebaseService } from '../firebase-integration.service';
import { FirebaseListingItemModel } from './firebase-listing.model';
import { FirebaseCreateUserModal } from '../user/create/firebase-create-user.modal';

import { DataStore, ShellModel } from '../../shell/data-store';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'app-firebase-listing',
    templateUrl: './firebase-listing.page.html',
    styleUrls: [
        './styles/firebase-listing.page.scss',
        './styles/firebase-listing.ios.scss',
        './styles/firebase-listing.shell.scss'
    ],
})
export class FirebaseListingPage implements OnInit, OnDestroy {
    rangeForm: FormGroup;
    searchQuery: string;
    showAgeFilter = false;

    searchSubject: ReplaySubject<any> = new ReplaySubject<any>(1);
    searchFiltersObservable: Observable<any> = this.searchSubject.asObservable();

    listingDataStore: DataStore<Array<FirebaseListingItemModel>>;
    stateSubscription: Subscription;

    // Use Typescript intersection types to enable docorating the Array of firebase models with a shell model
    // (ref: https://www.typescriptlang.org/docs/handbook/advanced-types.html#intersection-types)
    items: Array<FirebaseListingItemModel> & ShellModel;

    @Input() rating: number;

    @HostBinding('class.is-shell') get isShell() {
        return (this.items && this.items.isShell) ? true : false;
    }
    
    public profileUser: any;
    public admUser: any;

    constructor(
        public firebaseService: FirebaseService,
        public modalController: ModalController,
        private route: ActivatedRoute,       
        private storage: Storage
    ) {


    }

    ngOnDestroy(): void {
        this.stateSubscription.unsubscribe();
    }

    ngOnInit() {

        this.storage.get('info_user').then((val) => { 
            this.profileUser = val.id; 
            this.admUser = val.tipoUser
        });

        this.searchQuery = '';

        /*this.rangeForm = new FormGroup({
            dual: new FormControl({ lower: 1, upper: 100 })
        }); */

        // Route data is a cold subscription, no need to unsubscribe?
        this.route.data.subscribe(
            (resolvedRouteData) => {
                this.listingDataStore = resolvedRouteData['data'];

                const updateSearchObservable = this.searchFiltersObservable.pipe(
                    switchMap((filters) => {
                        const filteredDataSource = this.firebaseService.searchUsersByAge(
                            filters.lower,
                            filters.upper
                        );
                        const searchingShellModel = [
                            new FirebaseListingItemModel(),
                            new FirebaseListingItemModel()
                        ];
                        const searchingDelay = 400;

                        const dataSourceWithShellObservable = DataStore.AppendShell(filteredDataSource, searchingShellModel, searchingDelay);

                        return dataSourceWithShellObservable.pipe(
                            map(filteredItems => {
                                // Just filter items by name if there is a search query and they are not shell values
                                if (filters.query !== '' && !filteredItems.isShell) {
                                    const queryFilteredItems = filteredItems.filter(item =>
                                        item.name.toLowerCase().includes(filters.query.toLowerCase()
                                        ));
                                    // While filtering we strip out the isShell property, add it again
                                    return Object.assign(queryFilteredItems, { isShell: filteredItems.isShell });
                                } else {
                                    return filteredItems;
                                }
                            })
                        );
                    })
                );

                this.stateSubscription = merge(
                    this.listingDataStore.state,
                    updateSearchObservable
                ).subscribe(
                    (state) => {
                        this.items = state;
                        this.removeItem(this.items, this.profileUser)
                    },
                    (error) => console.log(error),
                    () => console.log('stateSubscription completed')
                );
            },
            (error) => console.log(error)
        );
    }

    removeItem(items, idRef) {
        this.items = items.filter(function (i) { return i.id !== idRef; });
    };

     getDadosUser(idUser) {
        return this.items.filter(function (i) { return i.id === idUser; });
    };

    async openFirebaseCreateModal() {
        const modal = await this.modalController.create({
            component: FirebaseCreateUserModal
        });
        await modal.present();
    }

}
