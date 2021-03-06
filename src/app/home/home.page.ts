import { Router } from '@angular/router';
import { Component, ViewChild, OnInit } from '@angular/core';
import { ModalController, IonSlides, Platform, AlertController } from '@ionic/angular';
import { ModalComponent } from '../modal/map/modal.component';
import { OrderComponent } from '../modal/order/order.component';
import { apiService, utilService } from '../providers/util.service';
import { Order } from '../../sdk/order_pb';
import { Vehicle } from '../../sdk/vehicle_pb';
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
  vehicles: Vehicle.AsObject[] = [];
  currentVehicle: Vehicle.AsObject;
  showLeftButton = false;
  showRightButton = true;
  order = new Order().toObject();
  sliderConfig = {
    slidesPerView: 4,
    effect: 'flip'
  };
  subscription: any;

  constructor(
    private router: Router,
    private platform: Platform,
    private modalController: ModalController) {
    //this.order = new Order().toObject();
    this.load(); // workaround to avoid empty for the first time
  }

  ngOnInit() {
    this.load();
  }

  load() {
    var i = 0;
    let stream = apiService.vehiclesClient.list(new Empty(), apiService.metaData);
    stream.on('data', response => {
      this.vehicles[i] = response.toObject();
      this.currentVehicle = this.vehicles[0];
      this.order.type = this.currentVehicle.name;
      i++;
      this.vehicles = this.vehicles.slice(0, i);
    });
    stream.on('error', err => {
      console.log(err);
      utilService.alert(err.message, err.code + '');
    });
  }
  // Method executed when the slides are changed
  public slideChanged(): void {
    this.slides.getActiveIndex().then(e => {
      this.showLeftButton = e !== 0;
    });;
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
    this.ionViewWillLeave();
    const modal = await this.modalController.create({
      component: ModalComponent,
      componentProps: { value: 123 }
    });

    await modal.present();
    const result = await modal.onDidDismiss();
    this.order.from = result.data;
    this.ionViewDidEnter();
  }

  async presentToModal() {
    this.ionViewWillLeave();
    const modal = await this.modalController.create({
      component: ModalComponent,
      componentProps: { value: 123 }
    });

    await modal.present();
    const result = await modal.onDidDismiss();
    this.order.tosList = [result.data];
    this.computeFee();
    this.ionViewDidEnter();
  }

  computeFee() {
    if (this.order.from && this.order.tosList[0]) {
      const p1 = this.order.from.location.split(',');
      const p2 = this.order.tosList[0].location.split(',');
      // 返回 p1 到 p2 间的地面距离，单位：米
      console.log('hp1', p1);
      console.log('hp2', p2);
      const dis = AMap.GeometryUtil.distance(p1, p2) / 1000;
      if (dis < this.currentVehicle.price.start.distance) {
        this.order.fee = this.currentVehicle.price.start.fee;
      } else {
        this.order.fee = dis * this.currentVehicle.price.then;
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

    if (!this.order.from || !this.order.tosList[0]) {
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

  ionViewDidEnter() {
    this.subscription = this.platform.backButton.subscribe(async () => {
      const alert = await utilService.injector.get(AlertController).create({
        message: '确认退出[货运物联]客户端?',
        buttons: [
          {
            text: '取消'
          }, {
            text: '确定',
            handler: () => {
              navigator['app'].exitApp();
            }
          }
        ]
      });
      await alert.present();
    });
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }
}
