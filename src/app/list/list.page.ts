import * as grpcWeb from 'grpc-web';
import { OrdersClient } from '../../sdk/order_grpc_web_pb';
import { OrderList, Order } from '../../sdk/order_pb';
import { User } from '../../sdk/user_pb';
import { AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { loginService, apiService } from '../providers/util.service';

declare var startApp;

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  orders: any[];
  status = 'accept';

  constructor(private alertController: AlertController) {
    this.orders = [];
  }

  ngOnInit() {
    this.load()
  }

  load() {
    const tsUser = new User();
    tsUser.setId(loginService.getUser().id);
    apiService.ordersClient.listByUser(tsUser, apiService.metaData,
      (err: grpcWeb.Error, response: OrderList) => {
        if (err) {
          console.log(err);
        } else {
          for (var i in response.getItemsList()) {
            let tsOrder = response.getItemsList()[i]
            this.orders[i] = tsOrder.toObject();
            if (tsOrder.getSender() != null) {
              this.orders[i].sender = tsOrder.getSender().toObject();
            }
            if (tsOrder.getFrom() != null) {
              this.orders[i].from = tsOrder.getFrom().toObject();
            }
            if (tsOrder.getTosList()[0] != null) {
              this.orders[i].to = tsOrder.getTosList()[0].toObject();
            }
            this.orders[i].fee = tsOrder.getFee().toFixed(2);
            this.orders[i].created = tsOrder.getCreated().toDate();
          };
        }
        this.orders = this.orders.filter(order => order.status == this.status);
      });
  }

  refresh(event: any) {
    this.load();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  async navigate(order: any) {
    const alert = await this.alertController.create({
      header: '开启导航?',
      buttons: [
        {
          text: '取消',
        }, {
          text: '确定',
          handler: data => {
            var endLngLat = order.to.location.split(',');
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
            gaodeApp.start(function () {
              // alert('amap ok')
            }, function (error) {
              window.alert(error)
            })
          }
        }
      ]
    });
    await alert.present();
  }
}