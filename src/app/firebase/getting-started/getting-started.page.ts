import { Component, OnInit, AfterViewInit, ViewChild, HostBinding } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { IonSlides, MenuController, ModalController } from '@ionic/angular';

import { Observable, ReplaySubject, Subscription, merge } from 'rxjs';
import { FirebaseListingItemModel } from '../listing/firebase-listing.model';
import { DataStore, ShellModel } from '../../shell/data-store';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';
import { FirebaseService } from '../firebase-integration.service';
import { ModUserComponent } from '../mod-user/mod-user.component';
import { ConfimationPage } from '../user/confimation/confimation.page';

@Component({
    selector: 'app-getting-started',
    templateUrl: './getting-started.page.html',
    styleUrls: [
        './styles/getting-started.page.scss',
        './styles/getting-started.shell.scss',
        './styles/getting-started.responsive.scss'
    ]
})
export class GettingStartedPage implements OnInit, AfterViewInit {

    rangeForm: FormGroup;
    searchQuery: string;

    @ViewChild(IonSlides, { static: true }) slides: IonSlides;

    @HostBinding('class.last-slide-active') isLastSlide = false;
    @HostBinding('class.is-shell') get isShell() {
        return (this.items && this.items.isShell) ? true : false;
    }

    gettingStartedForm: FormGroup;

    searchSubject: ReplaySubject<any> = new ReplaySubject<any>(1);
    searchFiltersObservable: Observable<any> = this.searchSubject.asObservable();
    listingDataStore: DataStore<Array<FirebaseListingItemModel>>;
    items: Array<FirebaseListingItemModel> & ShellModel;
    stateSubscription: Subscription;

    public it = true;
    public itemIsCkeked = true;

    constructor(
        private route: ActivatedRoute,
        public menu: MenuController,
        public firebaseService: FirebaseService,
        public modalCtrl: ModalController,
        public router: Router,
    ) {

    }

    ngOnDestroy(): void {
        this.stateSubscription.unsubscribe();
    }

    ngOnInit(): void {

        this.menu.enable(false);

        this.searchQuery = '';

        this.rangeForm = new FormGroup({
            dual: new FormControl({ lower: 1, upper: 100 })
        });

        this.route.data.subscribe(
            (resolvedRouteData) => {
                this.listingDataStore = resolvedRouteData['data'];

                const updateSearchObservable = this.searchFiltersObservable.pipe(
                    switchMap((filters) => {
                        const filteredDataSource = this.firebaseService.searchUsersByAge(
                            filters.lower,
                            filters.upper
                        );
                        // Send a shell until we have filtered data from Firebase
                        const searchingShellModel = [
                            new FirebaseListingItemModel(),
                            new FirebaseListingItemModel()
                        ];
                        // Wait on purpose some time to ensure the shell animation gets shown while loading filtered data
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

                // Keep track of the subscription to unsubscribe onDestroy
                // Merge filteredData with the original dataStore state
                this.stateSubscription = merge(
                    this.listingDataStore.state,
                    updateSearchObservable
                ).subscribe(
                    (state) => {
                        this.items = state;
                    },
                    (error) => console.log(error),
                    () => console.log('stateSubscription completed')
                );
            },
            (error) => console.log(error)
        );
    }


    ngAfterViewInit(): void {
        // ViewChild is set
        this.slides.isEnd().then(isEnd => {
            this.isLastSlide = isEnd;
        });

        // Subscribe to changes
        this.slides.ionSlideWillChange.subscribe(changes => {
            this.slides.isEnd().then(isEnd => {
                this.isLastSlide = isEnd;
            });
        });
    }

    async abrirConfimacao(item: any) {
        const modal = await this.modalCtrl.create({
            component: ModUserComponent,
            componentProps: {
                'user': item
            },
            cssClass: 'modalUser'
        });
        await modal.present();
    }


}
