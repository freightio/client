import * as grpcWeb from 'grpc-web';
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { User } from '../../../sdk/user_pb';
import { Account } from '../../../sdk/wallet_pb';
import { Order } from '../../../sdk/order_pb';
import { utilService, apiService } from '../../providers/util.service';

declare var startApp;

@Component({
  selector: 'app-ongoing',
  templateUrl: './ongoing.page.html',
  styleUrls: ['./ongoing.page.scss'],
})
export class OngoingPage implements OnInit {
  orders: Order.AsObject[] = [];

  constructor(private alertController: AlertController) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.load();
  }

  load() {
    var i = 0;
    const tsUser = new User();
    tsUser.setId(utilService.getUser().id);
    let stream = apiService.ordersClient.listByUser(tsUser, apiService.metaData)
    stream.on('data', response => {
      if (response.getStatus() == 'accept') {
        if (this.orders[i] != null && this.orders[i].id == response.getId()) {
          i++;
          return
        }
        this.orders[i] = response.toObject();
        i++;
        this.orders = this.orders.slice(0, i);
      }
    });
    stream.on('error', err => {
      console.log(err);
      //this.load();
    });
  }

  async navigate(order: Order.AsObject) {
    const alert = await this.alertController.create({
      header: '开启导航?',
      buttons: [
        {
          text: '取消',
        }, {
          text: '确定',
          handler: data => {
            var endLngLat = order.tosList[0].location.split(',');
            let gaodeApp = startApp.set(
              {
                'action': 'ACTION_VIEW',
                'category': 'CATEGORY_DEFAULT',
                'type': 'text/css',
                'package': 'com.autonavi.minimap',
                'uri': 'androidamap://navi?sourceApplication=appname&poiname=' + 'this.item.work_address' + '&lat=' + endLngLat[1] + '&lon=' + endLngLat[0] + '&dev=0',
                'flags': ['FLAG_ACTIVITY_CLEAR_TOP', 'FLAG_ACTIVITY_CLEAR_TASK'],
                'intentstart': 'startActivity',
              }, { /* extras */
                'EXTRA_STREAM': 'extraValue1',
                'extraKey2': 'extraValue2'
              }
            );
            gaodeApp.start()
          }
        }
      ]
    });
    await alert.present();
  }

  async finish(order: Order.AsObject) {
    if (order.status != 'accept') {
      return
    }
    if (utilService.getUser().id != order.driverid) {
      utilService.alert('仅司机可确认订单!');
      return
    }
    const alert = await this.alertController.create({
      subHeader: '确认订单[' + order.sender.name + ']已完成?',
      message: '费用[' + order.fee + '元]将打入您的个人钱包中.',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: '确定',
          handler: data => {
            //TODO:put to backend in transaction
            let tsOrder = new Order();
            tsOrder.setId(order.id)
            tsOrder.setStatus('done');
            apiService.ordersClient.update(tsOrder, apiService.metaData,
              (err: grpcWeb.Error, response: Order) => {
                console.log(response);
              });

            let account = new Account();
            account.setFee(order.fee);
            account.setOrderid(order.id);
            account.setUserid(order.driverid);
            apiService.walletsClient.add(account, apiService.metaData, (err: grpcWeb.Error, response: Account) => {
              console.log(response);
            })
          }
        }
      ]
    });
    await alert.present();
  }

  // ionViewDidLeave() {
  //   this.orders = [];
  // }
}
