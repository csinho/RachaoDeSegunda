import { Component, OnInit, OnDestroy, HostBinding, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { Observable, ReplaySubject, Subscription, merge } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { FirebaseService } from '../../firebase-integration.service';
import { FirebaseListingItemModel } from '../../listing/firebase-listing.model';
import { FirebaseCreateUserModal } from '../../user/create/firebase-create-user.modal';

import { DataStore, ShellModel } from '../../../shell/data-store';

import { ChartDataSets, ChartType, RadialChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.page.html',
    styleUrls: [
        './styles/user-profile.page.scss',
        './styles/user-profile.shell.scss',
        './styles/user-profile.ios.scss',
        './styles/user-profile.md.scss'
    ],
})
export class UserProfilePage implements OnInit, OnDestroy {

    public radarChartOptions: RadialChartOptions = {
        responsive: true,
    };
    public radarChartLabels: Label[];

    public radarChartData: ChartDataSets[];

    public radarChartType: ChartType = 'radar';


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

    public dadosUser: any;

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
    ) { }


    ngOnDestroy(): void {
        this.stateSubscription.unsubscribe();
    }


    ngOnInit() {

        this.storage.get('info_user').then((val) => { this.profileUser = val.id; });

        this.searchQuery = '';

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
        this.items = items.filter(function (i) { return i.id === idRef; });

        var skillsNome = [];
        var skillsValor = [];


        this.items.forEach(user => {
            for (var x = 0; x < user.skillsMedia.length; x++) {
                skillsNome.unshift(user.skillsMedia[x].nome);
                skillsValor.unshift(user.skillsMedia[x].valor);
            }

            this.radarChartLabels = skillsNome;

            this.radarChartData = [
                {
                    data: skillsValor,
                    label: 'Habilidades',
                    backgroundColor: "rgba(232, 216, 37, 0.411)",
                    borderColor: "rgba(0, 0, 0, 1)",
                    borderWidth: 2,
                    hoverBackgroundColor: "rgba(255,99,132,0.4)",
                    hoverBorderColor: "rgba(255,99,132,1)",
                }
            ];
        })

    };

    async openFirebaseCreateModal() {
        const modal = await this.modalController.create({
            component: FirebaseCreateUserModal
        });
        await modal.present();
    }

}
