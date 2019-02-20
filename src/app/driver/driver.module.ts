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
        path: 'default',
        children: [
          {
            path: '',
            //component: GrabPage,
            loadChildren: './default/default.module#DefaultPageModule',
          }
        ]
      },
      {
        path: 'grab',
        children: [
          {
            path: '',
            //component: DefaultPage,
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
        redirectTo: '/driver/default',
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
