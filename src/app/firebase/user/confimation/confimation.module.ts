import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../../components/components.module';

import { FirebaseService } from '../../firebase-integration.service';
import { ConfimationPage } from './confimation.page';
import { ConfimationResolver } from './confimation.resolver';

const routes: Routes = [
  {
    path: '',
    component: ConfimationPage,
    resolve: {
      data: ConfimationResolver
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule
  ],
  declarations: [ConfimationPage],
  providers: [
    FirebaseService,
    ConfimationResolver,
  ]
})
export class ConfimationPageModule {}
