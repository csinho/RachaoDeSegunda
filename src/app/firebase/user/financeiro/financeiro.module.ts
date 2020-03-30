import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../../components/components.module';
import { FinanceiroResolver } from './financeiro.resolver';
import { FinanceiroPage } from './financeiro.page';


const routes: Routes = [
    {
        path: '',
        component: FinanceiroPage,
        resolve: {
            data: FinanceiroResolver
        }
    }
];

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        ComponentsModule,
        RouterModule.forChild(routes),
    ],
    declarations: [FinanceiroPage],
    providers: [
        FinanceiroResolver
    ]
})
export class FinanceiroPageModule { }
