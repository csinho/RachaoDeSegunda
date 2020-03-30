import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import * as dayjs from 'dayjs';

import { CheckboxCheckedValidator } from '../../../validators/checkbox-checked.validator';

import { FirebaseService } from '../../firebase-integration.service';
import { FirebaseUserModel } from '../firebase-user.model';
import { SelectUserImageModal } from '../select-image/select-user-image.modal';

@Component({
    selector: 'app-firebase-create-user',
    templateUrl: './firebase-create-user.modal.html',
    styleUrls: [
        './styles/firebase-create-user.modal.scss',
        './styles/firebase-create-user.shell.scss'
    ],
})
export class FirebaseCreateUserModal implements OnInit {
    createUserForm: FormGroup;
    userData: FirebaseUserModel = new FirebaseUserModel();
    skills = [];

    public mes = [];
    public meses = [{ nome: "", valor: 0, status: 0 }];
    public selectedRadioGroup: any;
    public skillsMedia = [
        { nome: "Raça", valor: 0 },
        { nome: "Drible", valor: 0 },
        { nome: "Marcação", valor: 0 },
        { nome: "Passe", valor: 0 },
        { nome: "Chute", valor: 0 },
        { nome: "Velocidade", valor: 0 },
    ];

    constructor(
        private modalController: ModalController,
        public firebaseService: FirebaseService
    ) { }


    radioGroupChange(event) {
        this.selectedRadioGroup = event.detail.value;
    }

    ngOnInit() {
        // default image
        this.userData.avatar = 'https://s3-us-west-2.amazonaws.com/ionicthemes/otros/avatar-placeholder.png';

        this.createUserForm = new FormGroup({
            name: new FormControl('', Validators.required),
            lastname: new FormControl('', Validators.required),
            phone: new FormControl('', Validators.required),
            skills: new FormArray([], CheckboxCheckedValidator.minSelectedCheckboxes(1)),
        });

        this.firebaseService.getSkills().subscribe(skills => {
            this.skills = skills;
            // create skill checkboxes
            this.skills.map(() => {
                (this.createUserForm.controls.skills as FormArray).push(new FormControl());
            });
        });

        var arrayMes = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

        var data = new Date();

        for (let i = 0, x = data.getMonth() - 1; i < 12; i++) {
            this.mes.push(arrayMes[++x % 12].toUpperCase());
        }

        this.mes.forEach(item => {
            this.meses.push({ nome: item, valor: 0, status: 0 })
        });

        this.meses = this.meses.filter(function (obj) {
            return obj.nome != "";
        });
    }

    get skillsFormArray() {
        return <FormArray>this.createUserForm.get('skills');
    }

    changeLangValue(value): string {
        switch (true) {
            case (value <= 3):
                return 'Básico';
            case (value > 3 && value <= 6):
                return 'Médio';
            case (value > 6):
                return 'Expert';
        }
    }

    dismissModal() {
        this.modalController.dismiss();
    }

    createUser() {

        this.userData.name = this.createUserForm.value.name;
        this.userData.lastname = this.createUserForm.value.lastname;
        this.userData.phone = this.createUserForm.value.phone;
        this.userData.createdAt = new Date().getTime();
        this.userData.statusJogador = 0;
        this.userData.meses = this.meses;
        this.userData.mediaSemana = 0;
        this.userData.mediaMes = 0;
        this.userData.tipoUser = this.selectedRadioGroup

        this.userData.skillsMedia = [
            { nome: this.skillsMedia[0].nome, valor: this.skillsMedia[0].valor },
            { nome: this.skillsMedia[1].nome, valor: this.skillsMedia[1].valor },
            { nome: this.skillsMedia[2].nome, valor: this.skillsMedia[2].valor },
            { nome: this.skillsMedia[3].nome, valor: this.skillsMedia[3].valor },
            { nome: this.skillsMedia[4].nome, valor: this.skillsMedia[4].valor },
            { nome: this.skillsMedia[5].nome, valor: this.skillsMedia[5].valor },
        ]
        
        // get the ids of the selected skills
        const selectedSkills = [];

        this.createUserForm.value.skills
            .map((value: any, index: number) => {
                if (value) {
                    selectedSkills.push(this.skills[index].id);
                }
            });
        this.userData.skills = selectedSkills;

        this.firebaseService.createUser(this.userData)
            .then(() => {
                this.dismissModal();
            });
    }

    async changeUserImage() {
        const modal = await this.modalController.create({
            component: SelectUserImageModal
        });

        modal.onDidDismiss().then(avatar => {
            if (avatar.data != null) {
                this.userData.avatar = avatar.data.link;
            }
        });
        await modal.present();
    }

}
