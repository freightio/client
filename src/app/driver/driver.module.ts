import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DriverPage } from './driver.page';
import {GrabPage} from './grab/grab.page';
import {OngoingPage} from './ongoing/ongoing.page';
import {CertificationPage} from './certification/certification.page';

import {GrabPageModule} from './grab/grab.module';
import {OngoingPageModule} from './ongoing/ongoing.module';
import {CertificationPageModule} from './certification/certification.module';

const routes: Routes = [
  {
    path: '',
    component: DriverPage,
    children: [
      {
        path: 'grab',
        children: [
          {
            path: '',
            //component: GrabPage,
            loadChildren: './grab/grab.module#GrabPageModule',
          }
        ]
      },
      {
        path: 'ongoing',
        children: [
          {
            path: '',
            //component:OngoingPage,
            loadChildren: './ongoing/ongoing.module#OngoingPageModule'
          }
        ]
      },
      {
        path: 'certification',
        children: [
          {
            path: '',
            //component:CertificationPage,
            loadChildren: './certification/certification.module#CertificationPageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '/driver/grab',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    //GrabPageModule,
    //OngoingPageModule,
    //CertificationPageModule
  ],
  declarations: [DriverPage]
})
export class DriverPageModule { }
