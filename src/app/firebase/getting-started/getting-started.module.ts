import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../components/components.module';

import { GettingStartedPage } from './getting-started.page';
import { FirebaseService } from '../firebase-integration.service';
import { GettingStartedResolver } from './getting-started.resolver';
import { ModUserComponent } from '../mod-user/mod-user.component';
import { ConfimationPage } from '../user/confimation/confimation.page';

const routes: Routes = [
  {
    path: '',
    component: GettingStartedPage,
    resolve: {
      data: GettingStartedResolver
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
  declarations: [GettingStartedPage, ConfimationPage, ModUserComponent],
  entryComponents: [ModUserComponent, ConfimationPage],
  providers: [
    FirebaseService,
    GettingStartedResolver
  ]
})
export class GettingStartedPageModule {}
