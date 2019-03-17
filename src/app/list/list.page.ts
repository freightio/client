import { User } from '../../sdk/user_pb';
import { Order } from '../../sdk/order_pb';
import { AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { utilService, apiService } from '../providers/util.service';

declare var startApp;

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  orders: Order.AsObject[] = [];
  status = 'accept';

  constructor(private alertController: AlertController) {
    this.orders = [];
  }

  ngOnInit() {
    this.load()
  }

  load() {
    var i = 0;
    const tsUser = new User();
    tsUser.setId(utilService.getUser().id);
    let stream = apiService.ordersClient.listByUser(tsUser, apiService.metaData);
    stream.on('data', response => {
      if (response.getStatus() == this.status) {
        this.orders[i] = response.toObject();
        i++;
      }
      this.orders = this.orders.slice(0, i);
    });
    stream.on('error', err => {
      console.log(err);
    });
  }

  refresh(event: any) {
    this.load();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
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