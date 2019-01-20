import { Component, ViewChild, OnInit } from '@angular/core';
import { ModalController, IonSlides } from '@ionic/angular';
import { ModalComponent } from '../modal/map/modal.component';
import { OrderComponent } from '../modal/order/order.component';
//import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { loginService } from '../providers/util.service';
import { environment } from '../../environments/environment';
import * as grpcWeb from 'grpc-web';
import { VehiclesClient } from '../../sdk/vehicle_grpc_web_pb';
import { VehicleList, Empty } from '../../sdk/vehicle_pb';

declare var AMap;
declare var proto;

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
  vehiclesClient = new VehiclesClient(environment.apiUrl, null, null);
  sliderConfig = {
    slidesPerView: 4,
    effect: 'flip'
  };

  constructor(
    private modalController: ModalController,
    private qrScanner: QRScanner) {
    this.order = new proto.backend.Order();
  }

  ngOnInit() {
    this.vehiclesClient.list(new Empty(), {},
      (err: grpcWeb.Error, response: VehicleList) => {
        if (err) {
          console.log(err)
          this.ngOnInit();
        }
        for (var i in response.getItemsList()) {
          let tsVehicle = response.getItemsList()[i]
          console.log(tsVehicle.toObject());
          this.vehicles[i] = tsVehicle.toObject();
        }
        this.currentVehicle = this.vehicles[0];
        this.order.type = this.currentVehicle.name;
      })
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
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted
          alert("camera permission was granted");
          (window.document.querySelector('ion-app') as HTMLElement).classList.add('transparentBody');
          // window.document.querySelector('ion-app').classList.add('transparentBody');
          // start scanning
          let scanSub = this.qrScanner.scan().subscribe((text: string) => {
            console.log('Scanned something', text);
            alert(text);
            this.qrScanner.hide(); // hide camera preview
            scanSub.unsubscribe(); // stop scanning
            (window.document.querySelector('ion-app') as HTMLElement).classList.remove('transparentBody');
            //window.document.querySelector('ion-app').classList.remove('transparentBody')
          });

        } else if (status.denied) {
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })
      .catch((e: any) => {
        console.log('Error is', e);
        window.document.querySelector('ion-app').classList.remove('transparentBody')
      });
  }

  async beginNow() {
    if (!this.order.from || !this.order.tos) {
      alert('订单起点与终点不能为空!');
      return
    }

    if (!loginService.getUser().id) {
      return
    }

    const modal = await this.modalController.create({
      component: OrderComponent,
      componentProps: {
        order: this.order
        // from: this.from,
        // to: this.to,
        // fee: this.fee,
        // type: this.currentFreight.name
      }
    });

    await modal.present();
    const result = await modal.onDidDismiss();
    // this.from = result;
  }
}
