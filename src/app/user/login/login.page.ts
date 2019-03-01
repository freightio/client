import * as grpcWeb from 'grpc-web';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Events } from '@ionic/angular';
import { User } from '../../../sdk/user_pb';
import { utilService, apiService } from '../../providers/util.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  tel = '';
  password = '';

  constructor(
    private events: Events,
    private router: Router, ) { }

  ngOnInit() { }

  login() {
    const tsUser = new User();
    tsUser.setTel(this.tel);
    tsUser.setPassword(this.password);
    apiService.userClient.login(tsUser, apiService.metaData, (err: grpcWeb.Error, response: User) => {
      if (err) {
        console.log(err.code, err.message);
        utilService.alert('手机号或密码不正确.');
      } else {
        let username = response.getName();
        this.events.publish('user:login', username);
        utilService.setUser(response.toObject());
        this.router.navigateByUrl('/home');
      }
      console.log(response);
    })
  }

  signup() {
    this.router.navigateByUrl('/signup');
  }

  logout() {
    utilService.logout();
  }
}
