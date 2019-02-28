import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  privacy: any;

  constructor(
    public alertController: AlertController,
    public http: HttpClient) { }

  ngOnInit() {
    this.http.get('https://raw.githubusercontent.com/freightio/client/master/src/assets/privacy.txt').subscribe(
      response => {
        console.log(response);
      }, err => {
        console.log(err.error.text);
        this.privacy = err.error.text;
      });
  }

  async popupPrivacy() {
    const alert = await this.alertController.create({
      header: '隐私声明',
      message: this.privacy,
      buttons: ['OK']
    });

    await alert.present();
  }
}
