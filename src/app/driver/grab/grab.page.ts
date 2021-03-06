import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Position, Order } from '../../../sdk/order_pb';
import { utilService, apiService } from '../../providers/util.service';

//declare var proto;
declare var AMap;

@Component({
  selector: 'app-grab',
  templateUrl: './grab.page.html',
  styleUrls: ['./grab.page.scss'],
})
export class GrabPage implements OnInit {
  orders: Order.AsObject[] = [];

  constructor(
    private router: Router,
    private geolocation: Geolocation,
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.load();
  }

  load() {
    var i = 0;
    this.geolocation.getCurrentPosition().then((resp) => {
      let positon = new Position()
      positon.setLocation(resp.coords.latitude + ',' + resp.coords.longitude);
      let stream = apiService.ordersClient.listByPositon(positon, apiService.metaData);
      stream.on('data', response => {
        this.orders[i] = response.toObject();
        this.loadDistance(this.orders[i]);
        i++;
        this.orders = this.orders.slice(0, i);
      });
      stream.on('error', err => {
        console.log(err);
        this.load();
      });
    });
  }

  refresh(event) {
    this.load();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  async showUserDetail(order: Order.AsObject) {
    utilService.order = order;
    this.router.navigateByUrl('/intinery');
  }

  loadDistance(order: Order.AsObject) {
    this.geolocation.getCurrentPosition().then(res => {
      let p1 = ['' + res.coords.longitude, '' + res.coords.latitude]
      let p2 = order.from.location.split(',')
      const dis = AMap.GeometryUtil.distance(p1, p2);
      order.annotationsMap['distance'] = Math.trunc(dis / 1000);
    }).catch(e => {
      console.log(e);
    });
  }
}
