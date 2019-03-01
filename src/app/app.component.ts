import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { Platform, MenuController, Events } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { utilService } from './providers/util.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  username = '登录';
  isAdmin = false;
  public appPages = [
    {
      title: '快速下单',
      url: '/home',
      icon: 'home'
    },
    {
      title: '订单列表',
      url: '/list',
      icon: 'list'
    },
    {
      title: '我的钱包',
      url: '/wallet',
      icon: 'briefcase'
    },
    {
      title: '更多设置',
      url: '/settings',
      icon: 'settings'
    }
  ];

  constructor(
    private events: Events,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    public menuCtrl: MenuController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleBlackTranslucent();
      this.splashScreen.hide();
      this.listenForLoginEvents();

      if (window.localStorage.getItem('user')) {
        this.username = utilService.getUser().name;
      }
      if (utilService.getUser() && (
        utilService.getUser().tel == '15311410699' ||
        utilService.getUser().tel == '18819116381')
      ) {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
    });
  }

  async login(ev: any) {
    this.router.navigateByUrl('/login');
    this.menuCtrl.close();
  }

  listenForLoginEvents() {
    this.events.subscribe('user:login', (username) => {
      this.initializeApp();
    });
  }
}
