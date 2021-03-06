import { Injectable, Injector } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { UsersClient } from '../../sdk/user_grpc_web_pb';
import { WalletsClient } from '../../sdk/wallet_grpc_web_pb';
import { OrdersClient } from '../../sdk/order_grpc_web_pb';
import { VehiclesClient } from '../../sdk/vehicle_grpc_web_pb';
import { CertificationsClient } from '../../sdk/user_grpc_web_pb';
import { environment } from '../../environments/environment';
import { Order } from '../../sdk/order_pb';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  injector: Injector;
  order: Order.AsObject;

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
    const alert = await this.injector.get(AlertController).create({
      header: title,
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
  }
}

export class ApiService {
  userClient = new UsersClient(environment.apiUrl);
  ordersClient = new OrdersClient(environment.apiUrl);
  walletsClient = new WalletsClient(environment.apiUrl);
  vehiclesClient = new VehiclesClient(environment.apiUrl);
  certificationsClient = new CertificationsClient(environment.apiUrl);

  metaData = { 'authorization-token': 'admin' };
}

export const apiService = new ApiService();
export const utilService = new UtilService();