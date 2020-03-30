import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: () => import('../firebase/user/profile/user-profile.module').then(m => m.UserProfilePageModule)
            
          },
        ]
      },
      {
        path: 'users',
        children: [
          {
            path: '',
            loadChildren: () => import('../firebase/listing/firebase-listing.module').then(m => m.FirebaseListingPageModule)
          },
        ]
      },
      {
        path: 'financeiro',
        children: [
          {
            path: '',
            loadChildren: () => import('../firebase/user/financeiro/financeiro.module').then(m => m.FinanceiroPageModule)
          } 
        ]
      },
      
    ]
  },
  // /app/ redirect
  {
    path: '',
    redirectTo: 'app/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), HttpClientModule],
  exports: [RouterModule],
  providers: [ ]
})
export class TabsPageRoutingModule {}
