import { Component, OnInit, Input, NgZone } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';

import * as dayjs from 'dayjs';

import { CheckboxCheckedValidator } from '../../../validators/checkbox-checked.validator';

import { FirebaseService } from '../../firebase-integration.service';
import { FirebaseUserModel } from '../firebase-user.model';
import { SelectUserImageModal } from '../select-image/select-user-image.modal';

@Component({
    selector: 'app-firebase-update-user',
    templateUrl: './firebase-update-user.modal.html',
    styleUrls: [
        './styles/firebase-update-user.modal.scss',
        './styles/firebase-update-user.shell.scss'
    ],
})
export class FirebaseUpdateUserModal implements OnInit {
    // "user" is passed in firebase-details.page
    @Input() user: FirebaseUserModel;

    updateUserForm: FormGroup;
    selectedAvatar: string;
    skills = [];

    constructor(
        private modalController: ModalController,
        public alertController: AlertController,
        public firebaseService: FirebaseService,
        public router: Router,
        private ngZone: NgZone
    ) { }

    ngOnInit() {

        this.selectedAvatar = this.user.avatar;

        this.updateUserForm = new FormGroup({
            name: new FormControl(this.user.name, Validators.required),
            lastname: new FormControl(this.user.lastname, Validators.required),
            phone: new FormControl(this.user.phone, Validators.required),
            skills: new FormArray([], CheckboxCheckedValidator.minSelectedCheckboxes(1)),
        });

        this.firebaseService.getSkills().subscribe(skills => {
            this.skills = skills;
            // create skill checkboxes
            this.skills.map((skill) => {
                let userSkillsIds = [];
                if (this.user.skills) {
                    userSkillsIds = this.user.skills.map(function (skillId) {
                        return skillId['id'];
                    });
                }
                // defina o valor do controle como 'true' se o usuário já tiver essa habilidade
                const control = new FormControl(userSkillsIds.includes(skill.id));
                (this.updateUserForm.controls.skills as FormArray).push(control);
            });
        });
    }

    get skillsFormArray() { return <FormArray>this.updateUserForm.get('skills'); }

    changeLangValue(value): string {
        switch (true) {
            case (value <= 3):
                return 'Novice';
            case (value > 3 && value <= 6):
                return 'Competent';
            case (value > 6):
                return 'Expert';
        }
    }

    dismissModal() {
        this.modalController.dismiss();
    }

    async deleteUser() {
        const alert = await this.alertController.create({
            header: 'Confirma',
            message: 'Você quer deletar ' + this.user.name + '?',
            buttons: [
                {
                    text: 'Não',
                    role: 'cancel',
                    handler: () => { }
                },
                {
                    text: 'Sim',
                    handler: () => {
                        this.firebaseService.deleteUser(this.user.id)
                            .then(
                                () => {
                                    this.dismissModal();
                                    this.ngZone.run(() => this.router.navigate(['app/users'])).then();
                                },
                                err => console.log(err)
                            );
                    }
                }
            ]
        });
        await alert.present();
    }

    updateUser() {

        this.user.avatar = this.selectedAvatar;
        this.user.name = this.updateUserForm.value.name;
        this.user.lastname = this.updateUserForm.value.lastname;
        this.user.phone = this.updateUserForm.value.phone;

        // get the ids of the selected skills
        const selectedSkills = [];

        this.updateUserForm.value.skills
            .map((value: any, index: number) => {
                if (value) {
                    selectedSkills.push(this.skills[index].id);
                }
            });
        this.user.skills = selectedSkills;

        const { age, ...userData } = this.user; // we don't want to save the age in the DB because is something that changes over time

        this.firebaseService.updateUser(userData)
            .then(
                () => this.modalController.dismiss(),
                err => console.log(err)
            );
    }

    async changeUserImage() {
        const modal = await this.modalController.create({
            component: SelectUserImageModal
        });

        modal.onDidDismiss().then(avatar => {
            if (avatar.data != null) {
                this.selectedAvatar = avatar.data.link;
            }
        });
        await modal.present();
    }
}
