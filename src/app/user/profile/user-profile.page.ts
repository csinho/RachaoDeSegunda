import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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

export class UserProfilePage implements OnInit {
    @Input() rating: Number;
    profile: any;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
    ) {
        
    }

    ngOnInit(): void {
        
        const mediaCampo = 2
        const mediaAtitudes = 5

        this.rating = (mediaCampo + mediaAtitudes) / 2;

    }

}
