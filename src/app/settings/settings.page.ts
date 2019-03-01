import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { utilService } from '../providers/util.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  privacy: any;

  constructor(private http: HttpClient) { }

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
    utilService.alert(this.privacy, '隐私声明');
  }
}
