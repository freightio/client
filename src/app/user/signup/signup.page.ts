import * as grpcWeb from 'grpc-web';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { User } from '../../../sdk/user_pb';
import { apiService } from '../../providers/util.service';

declare var proto;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})

export class SignupPage implements OnInit {
  user: any;

  constructor(private router: Router) {
    //const tsUser = new User();
    this.user = new proto.backend.User();
  }

  ngOnInit() {
  }

  login() {
    this.router.navigateByUrl('/login');
  }

  signup() {
    if (!this.user.tel) {
      alert('请输入电话！');
      return
    }
    const tsUser = new User();
    tsUser.setName(this.user.name);
    tsUser.setTel(this.user.tel);
    tsUser.setPassword(this.user.password);
    apiService.userClient.add(tsUser, apiService.metaData, (err: grpcWeb.Error, response: User) => {
      if (err) {
        alert(err.message);
      } else {
        this.router.navigateByUrl('/login');
      }
      console.log(response);
    })
  }
}
