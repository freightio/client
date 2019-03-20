import { Router } from '@angular/router';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { apiService, utilService } from '../../providers/util.service';
import * as grpcWeb from 'grpc-web';
import { Order } from '../../../sdk/order_pb';
import { IDRequest } from '../../../sdk/user_pb';
import { BoolValue } from 'google-protobuf/google/protobuf/wrappers_pb';

declare var AMap;

@Component({
  selector: 'app-intinery',
  templateUrl: './intinery.page.html',
  styleUrls: ['./intinery.page.scss'],
})
export class IntineryPage implements OnInit {
  @ViewChild('map_container') map_container: ElementRef;
  map: any;
  order = utilService.order;
  isDisplay = true;
  // Swipe Up / Down / Left / Right
  initialX = null;
  initialY = null;


  constructor(private router: Router) { }

  ngOnInit() {
    this.map = new AMap.Map(this.map_container.nativeElement, {
      view: new AMap.View2D({
        zoom: 11,
        rotateEnable: true,
        // center: [116.2314939, 40.2071555],
        showBuildingBlock: true
      })
    });
    this.map.setMapStyle('amap://styles/light');
    AMap.service('AMap.Geolocation', () => {
      const geolocation = new AMap.Geolocation({});
      //this.map.addControl(geolocation);
    });

    AMap.plugin('AMap.ToolBar', () => {
      var toolbar = new AMap.ToolBar();
      //this.map.addControl(toolbar);
    });

    AMap.plugin('AMap.Driving', () => {
      var driving = new AMap.Driving({
        policy: AMap.DrivingPolicy.LEAST_TIME,
        map: this.map
      })
      var startLngLat = this.order.from.location.split(','); //[116.379028, 39.865042]
      var endLngLat = this.order.tosList[0].location.split(',');//[116.427281, 39.903719]
      driving.search(startLngLat, endLngLat, function (status, result) {
        //console.log(result);
      })

    });
  }

  accept() {
    if (!utilService.getUser().id) {
      utilService.alert('请登录!')
      return;
    }
    let idRequest = new IDRequest();
    idRequest.setId(utilService.getUser().id);
    apiService.certificationsClient.verify(idRequest, apiService.metaData, (err: grpcWeb.Error, verified: BoolValue) => {
      if (verified.getValue()) {
        if (window.confirm('确定接单?')) {
          let tsOrder = new Order();
          tsOrder.setId(this.order.id)
          tsOrder.setStatus('accept');
          tsOrder.setDriverid(utilService.getUser().id);
          apiService.ordersClient.update(tsOrder, apiService.metaData,
            (err: grpcWeb.Error, response: Order) => {
              console.log(response);
              this.router.navigateByUrl('/driver/ongoing');
            });
        }
      } else {
        utilService.alert('请认证后再接单！')
      }
    });
  }

  public hidden() {
    this.isDisplay = !this.isDisplay
  }

  ionViewDidEnter() {
    document.getElementById('detail_order').addEventListener("touchstart", this.startTouch, false);
    document.getElementById('detail_order').addEventListener("touchmove", this.moveTouch, false);
  };

  startTouch(e) {
    this.initialX = e.touches[0].pageX;
    this.initialY = e.touches[0].pageY;
  };

  moveTouch(e) {
    this.hidden();
    e.preventDefault();
    if (this.initialX === null) {
      return;
    }

    if (this.initialY === null) {
      return;
    }

    var currentX = e.touches[0].pageX;
    var currentY = e.touches[0].pageY;

    var diffX = this.initialX - currentX;
    var diffY = this.initialY - currentY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      // sliding horizontally
      if (diffX > 0) {
        // swiped left
        console.log("swiped left");
      } else {
        // swiped right
        console.log("swiped right");
      }
    } else {
      // sliding vertically
      if (diffY > 0) {
        // swiped up
        console.log("swiped up");
        this.hidden();
      } else {
        // swiped down
        console.log("swiped down");
      }
    }
  }
}
