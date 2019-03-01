import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { UsersClient } from '../../sdk/user_grpc_web_pb';
import { WalletsClient } from '../../sdk/wallet_grpc_web_pb';
import { OrdersClient } from '../../sdk/order_grpc_web_pb';
import { VehiclesClient } from '../../sdk/vehicle_grpc_web_pb';
import { CertificationsClient } from '../../sdk/user_grpc_web_pb';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  order: any;
  alertController = new AlertController();

  getUser() {
    let localUser = window.localStorage.getItem('user');
    if (!localUser) {
      //window.alert('请登录!')
      return {}
    }
    return JSON.parse(localUser)
  }

  setUser(user) {
    window.localStorage.setItem('user', JSON.stringify(user));
  }

  logout() {
    window.localStorage.removeItem('user');
  }

  async alert(msg: string, title: string = '提示') {
    const alert = await this.alertController.create({
      header: title,
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
  }
}

export class ApiService {
  userClient = new UsersClient(environment.apiUrl, null, null);
  ordersClient = new OrdersClient(environment.apiUrl, null, null);
  walletsClient = new WalletsClient(environment.apiUrl, null, null);
  vehiclesClient = new VehiclesClient(environment.apiUrl, null, null);
  certificationsClient = new CertificationsClient(environment.apiUrl, null, null);

  metaData = { 'authorization-token': 'admin' };
}

export const apiService = new ApiService();
export const utilService = new UtilService();