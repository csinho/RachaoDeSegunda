import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../../components/components.module';
import { FirebaseService } from '../../firebase-integration.service';
import { UserProfileResolver } from './user-profile.resolver';
import { UserProfilePage } from './user-profile.page';
import { ChartsModule } from 'ng2-charts';



const routes: Routes = [
  {
    path: '',
    component: UserProfilePage,
    resolve: {
      data: UserProfileResolver
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ChartsModule,
    ComponentsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [UserProfilePage],
  providers: [
    FirebaseService,
    UserProfileResolver
  ]
})
export class UserProfilePageModule {}
