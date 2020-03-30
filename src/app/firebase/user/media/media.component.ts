import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { FirebaseUserModel } from '../firebase-user.model';
import { FirebaseService } from '../../firebase-integration.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'app-media',
    templateUrl: './media.component.html',
    styleUrls: ['./media.component.scss'],
})
export class MediaComponent implements OnInit {

    // "user" is passed in firebase-details.page
    @Input() user: FirebaseUserModel;
    @Input() rating_campo: number;
    @Input() rating_individual: number;

    @Input() rating_raça: number;
    @Input() rating_drible: number;
    @Input() rating_marcacao: number;
    @Input() rating_passe: number;
    @Input() rating_chute: number;
    @Input() rating_velocidade: number;


    public userSkillsIds = [];

    public profileUser: any;
    public infoSkills = [];

    skills = [];

    public media = 0;
    public skillsMedia = [
        { nome: "Raça", valor: 0 },
        { nome: "Drible", valor: 0 },
        { nome: "Marcação", valor: 0 },
        { nome: "Passe", valor: 0 },
        { nome: "Chute", valor: 0 },
        { nome: "Velocidade", valor: 0 },

    ];

    constructor(
        public alertController: AlertController,
        public loadingController: LoadingController,
        private modalCtrl: ModalController,
        public router: Router,
        public firebaseService: FirebaseService,
        private storage: Storage
    ) {

    }

    ngOnInit() {

        this.storage.get('info_user').then((val) => {
            this.profileUser = val
        });

        //this.profileUser = this.userService.getDestn();

        this.firebaseService.getSkills().subscribe(skills => {
            this.skills = skills;

            // create skill checkboxes
            this.skills.map((skill) => {
                if (this.user.skills) {
                    this.userSkillsIds = this.user.skills.map(function (skillId) {
                        return skillId['id'];
                    });
                }
            });
        });

    }

    onClick(rating: number): void {
        this.rating_campo = rating;
    }
    onClick_individual(rating: number): void {
        this.rating_individual = rating;
    }

    onClick_raca(rating: number): void {
        this.rating_raça = rating;
    }
    onClick_drible(rating: number): void {
        this.rating_drible = rating;
    }
    onClick_marcacao(rating: number): void {
        this.rating_marcacao = rating;
    }
    onClick_passe(rating: number): void {
        this.rating_passe = rating;
    }
    onClick_chute(rating: number): void {
        this.rating_chute = rating;
    }
    onClick_velocidade(rating: number): void {
        this.rating_velocidade = rating;
    }

    confirmaMedia() {
        this.presentAlertConfirm(this.rating_campo, this.rating_individual)
    }

    async presentAlertConfirm(campo, individual) {
        const alert = await this.alertController.create({
            header: 'Confirma as Médias',
            message: 'Média de Campo: <b>' + campo + '</b><br><br>'
                + 'Média Individual: <b>' + individual + '</b>',
            buttons: [
                {
                    text: 'Não',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {

                    }
                }, {
                    text: 'Votar',
                    handler: () => {
                        this.media = (campo + individual) / 2;

                        if (this.media <= 1.5) {
                            this.media = 1
                        }
                        else if (this.media >= 1.6 && this.media <= 2.5) {
                            this.media = 2
                        }
                        else if (this.media >= 2.6 && this.media <= 3.5) {
                            this.media = 3
                        }
                        else if (this.media >= 3.6 && this.media <= 4.5) {
                            this.media = 4
                        }
                        else if (this.media >= 4.6) {
                            this.media = 5
                        }

                        this.user.idMedia.unshift(this.profileUser.id)

                        this.user.mediaSemana = this.media + this.user.mediaSemana;
                        this.user.skills = this.userSkillsIds;


                        this.skillsMedia[0].valor = this.rating_raça
                        this.skillsMedia[1].valor = this.rating_drible
                        this.skillsMedia[2].valor = this.rating_marcacao
                        this.skillsMedia[3].valor = this.rating_passe
                        this.skillsMedia[4].valor = this.rating_chute
                        this.skillsMedia[5].valor = this.rating_velocidade

                        this.user.skillsMedia = [
                            { nome: this.skillsMedia[0].nome, valor: this.user.skillsMedia[0].valor + this.skillsMedia[0].valor },
                            { nome: this.skillsMedia[1].nome, valor: this.user.skillsMedia[1].valor + this.skillsMedia[1].valor },
                            { nome: this.skillsMedia[2].nome, valor: this.user.skillsMedia[2].valor + this.skillsMedia[2].valor },
                            { nome: this.skillsMedia[3].nome, valor: this.user.skillsMedia[3].valor + this.skillsMedia[3].valor },
                            { nome: this.skillsMedia[4].nome, valor: this.user.skillsMedia[4].valor + this.skillsMedia[4].valor },
                            { nome: this.skillsMedia[5].nome, valor: this.user.skillsMedia[5].valor + this.skillsMedia[5].valor },
                        ]

                        const { age, ...userData } = this.user; // we don't want to save the age in the DB because is something that changes over time

                        this.firebaseService.updateUser(userData)
                            .then(
                                () => this.presentLoadingWithOptions(),
                                err => console.log(err)
                            );
                    }
                }
            ]
        });
        await alert.present();
    }

    async presentLoadingWithOptions() {
        const loading = await this.loadingController.create({
            spinner: 'lines',
            duration: 3000,
            message: 'Sua votação está sendo computada...',
            translucent: true,
            cssClass: 'custom-class custom-loading',
            backdropDismiss: true

        });
        await loading.present();
        this.modalCtrl.dismiss();
        this.router.navigate(['app/users']);
    }

}
