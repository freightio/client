import { Router } from '@angular/router';
import { Component, ViewChild, OnInit } from '@angular/core';
import { ModalController, IonSlides } from '@ionic/angular';
import { ModalComponent } from '../modal/map/modal.component';
import { OrderComponent } from '../modal/order/order.component';
import { apiService, utilService } from '../providers/util.service';
import * as grpcWeb from 'grpc-web';
import { Order } from '../../sdk/order_pb';
import { VehicleList } from '../../sdk/vehicle_pb';
import { Empty } from "google-protobuf/google/protobuf/empty_pb";

declare var AMap;
//declare var proto;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;
  vehicles = [];
  currentVehicle: any;
  showLeftButton = false;
  showRightButton = true;
  to: any;
  order: any;
  sliderConfig = {
    slidesPerView: 4,
    effect: 'flip'
  };

  constructor(
    private router: Router,
    private modalController: ModalController) {
    this.order = new Order().toObject();
  }

  ngOnInit() {
    apiService.vehiclesClient.list(new Empty(), apiService.metaData,
      (err: grpcWeb.Error, response: VehicleList) => {
        if (err) {
          console.log(err);
          this.ngOnInit();
        }
        for (var i in response.getItemsList()) {
          let tsVehicle = response.getItemsList()[i]
          this.vehicles[i] = tsVehicle.toObject();
        }
        this.currentVehicle = this.vehicles[0];
        this.order.type = this.currentVehicle.name;
      });
  }
  // Method executed when the slides are changed
  public slideChanged(): void {
    this.slides.getActiveIndex().then(e => {
      this.showLeftButton = e !== 0;
    });
    this.slides.length().then(e => {
      this.showRightButton = e !== Math.ceil(e / 4);
    });
  }

  // Method that shows the next slide
  public slideNext(): void {
    this.slides.slideNext();
  }

  // Method that shows the previous slide
  public slidePrev(): void {
    this.slides.slidePrev();
  }

  itemClick(vehicle) {
    this.currentVehicle = vehicle;
    this.order.type = vehicle.name;
    this.computeFee();
  }

  async presentFromModal() {
    const modal = await this.modalController.create({
      component: ModalComponent,
      componentProps: { value: 123 }
    });

    await modal.present();
    const result = await modal.onDidDismiss();
    // this.from = result;
    this.order.from = result.data;
  }

  async presentToModal() {
    const modal = await this.modalController.create({
      component: ModalComponent,
      componentProps: { value: 123 }
    });

    await modal.present();
    const result = await modal.onDidDismiss();
    this.to = result.data;
    this.order.tos = [result.data];
    this.computeFee();
  }

  computeFee() {
    if (this.order.from && this.order.tos[0]) {
      const p1 = this.order.from.location.split(',');
      const p2 = this.order.tos[0].location.split(',');
      // 返回 p1 到 p2 间的地面距离，单位：米
      console.log('hp1', p1);
      console.log('hp2', p2);
      const dis = AMap.GeometryUtil.distance(p1, p2) / 1000;
      if (dis < this.currentVehicle.price.start.distance) {
        this.order.fee = this.currentVehicle.price.start.fee;
      } else {
        this.order.fee = (dis * this.currentVehicle.price.then).toFixed(2);
      }
      //this.fee = dis * this.currentFreight.price / 1000;
      //this.order.fee = (dis * this.currentFreight.price / 1000).toFixed(2);
    }
  }

  scanQR() {
    this.router.navigateByUrl('/scan');
  }

  async beginNow() {
    if (!utilService.getUser().id) {
      utilService.alert('请登录!');
      return
    }

    if (!this.order.from || !this.order.tos) {
      utilService.alert('订单起点与终点不能为空!');
      return
    }

    const modal = await this.modalController.create({
      component: OrderComponent,
      componentProps: {
        order: this.order
      }
    });

    await modal.present();
    const result = await modal.onDidDismiss();
  }
}
