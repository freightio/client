import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'list',
    loadChildren: './list/list.module#ListPageModule'
  },
  { path: 'driver', loadChildren: './driver/driver.module#DriverPageModule' },
  { path: 'certification', loadChildren: './driver/certification/certification.module#CertificationPageModule' },
  { path: 'intinery', loadChildren: './driver/intinery/intinery.module#IntineryPageModule' },
  { path: 'verify', loadChildren: './admin/verify/verify.module#VerifyPageModule' },
  { path: 'login', loadChildren: './user/login/login.module#LoginPageModule' },
  { path: 'signup', loadChildren: './user/signup/signup.module#SignupPageModule' },
  { path: 'wallet', loadChildren: './wallet/wallet.module#WalletPageModule' },
  { path: 'settings', loadChildren: './settings/settings.module#SettingsPageModule' },
  // { path: 'grab', loadChildren: './driver/grab/grab.module#GrabPageModule' },
  // { path: 'ongoing', loadChildren: './driver/ongoing/ongoing.module#OngoingPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
