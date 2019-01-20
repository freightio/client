import { Injectable } from '@angular/core';
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

  constructor() { }

  getUser() {
    let localUser = window.localStorage.getItem('user');
    if (!localUser) {
      window.alert('请登录!')
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
}

export class ApiService {
  userClient = new UsersClient(environment.apiUrl, null, null);
  ordersClient = new OrdersClient(environment.apiUrl, null, null);
  walletsClient = new WalletsClient(environment.apiUrl, null, null);
  vehiclesClient = new VehiclesClient(environment.apiUrl, null, null);
  certificationsClient = new CertificationsClient(environment.apiUrl, null, null);

  metaData = { 'custom-header-1': 'value1' };
}

export const loginService = new UtilService();
export const apiService = new ApiService();