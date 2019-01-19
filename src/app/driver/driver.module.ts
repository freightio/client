import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DriverPage } from './driver.page';

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
            loadChildren: './grab/grab.module#GrabPageModule'
          }
        ]
      },
      {
        path: 'ongoing',
        children: [
          {
            path: '',
            loadChildren: './ongoing/ongoing.module#OngoingPageModule'
          }
        ]
      },
      {
        path: 'certification',
        children: [
          {
            path: '',
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
    RouterModule.forChild(routes)
  ],
  declarations: [DriverPage]
})
export class DriverPageModule { }
