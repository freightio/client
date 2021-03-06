import { Component, OnInit } from '@angular/core';
import { NavParams, ActionSheetController, ModalController } from '@ionic/angular';
import { Contacts } from '@ionic-native/contacts/ngx';
import * as grpcWeb from 'grpc-web';
import { Account } from '../../../sdk/wallet_pb';
import { apiService, utilService } from '../../providers/util.service';
import { Order, Position, Sender, PayInfo } from '../../../sdk/order_pb';
import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb';
import { StringValue } from "google-protobuf/google/protobuf/wrappers_pb";

declare let cordova;
//declare var proto;

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  order: Order.AsObject = this.navParams.get('order');

  constructor(
    private navParams: NavParams,
    private contacts: Contacts,
    private modalController: ModalController,
    private actionSheetController: ActionSheetController
  ) { }

  ngOnInit() {
    let start = new Date();
    start.setMinutes(start.getMinutes() + 5);
    let tt = new Timestamp();
    tt.fromDate(start)
    this.order.start = tt.toObject();
    this.order.sender = new Sender().toObject();
  }

  selectContact() {
    this.contacts.pickContact().then(e => {
      this.order.sender.name = e.displayName;
      this.order.sender.tel = e.phoneNumbers[0].value;
    });
  }

  async presentActionSheet() {
    if (!this.order.sender.name || !this.order.sender.tel) {
      utilService.alert('请填写订单联系人与电话!');
      return
    }
    const actionSheet = await this.actionSheetController.create({
      header: '支付方式',
      buttons: [{
        text: '余额支付',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          if (window.confirm('确定余额支付?')) {
            let account = new Account();
            account.setFee(-this.order.fee);
            //account.setOrderid(order.id);
            account.setUserid(utilService.getUser().id);
            apiService.walletsClient.add(account, apiService.metaData, (err: grpcWeb.Error, response: Account) => {
              console.log(response);
              let payInfo = new PayInfo();
              payInfo.setType('walletpay');
              payInfo.setPayresult(JSON.stringify(response));
              this.addOrder(payInfo);
            })
          }
        }
      }, {
        text: '支付宝',
        icon: 'share',
        handler: () => {
          console.log('==', this.order);
          this.goToAlipay();
        }
      }, {
        text: '微信',
        icon: 'arrow-dropright-circle',
        handler: () => {
          console.log('Play clicked');
          alert('即将支持!');
        }
      }, {
        text: '取消',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  goToAlipay() {
    let tsOrder = new Order();
    tsOrder.setFee(this.order.fee);
    apiService.ordersClient.signAlipay(tsOrder, apiService.metaData,
      (err: grpcWeb.Error, response: StringValue) => {
        if (err) {
          utilService.alert(err.message)
        } {
          let payInfo = response.getValue();
          cordova.plugins.alipay.payment(payInfo, (success) => {
            console.log(success);
            //alert('success:' + JSON.stringify(success));
            let payInfo = new PayInfo();
            payInfo.setType('alipay');
            payInfo.setPayresult(JSON.stringify(success));
            this.addOrder(payInfo);
          }, (error) => {
            console.log(error);
            utilService.alert('error:' + JSON.stringify(error));
          });
        }
      });
  }

  addOrder(payInfo: PayInfo) {
    const tsOrder = new Order();
    tsOrder.setSender(new Sender());
    tsOrder.getSender().setId(utilService.getUser().id);
    tsOrder.getSender().setName(this.order.sender.name);
    tsOrder.getSender().setTel(this.order.sender.tel);

    tsOrder.setFrom(new Position());
    tsOrder.getFrom().setName(this.order.from.name);
    tsOrder.getFrom().setLocation(this.order.from.location);
    tsOrder.getFrom().setAddress(this.order.from.address);

    tsOrder.setTosList([new Position()])
    tsOrder.getTosList()[0].setName(this.order.tosList[0].name);
    tsOrder.getTosList()[0].setLocation(this.order.tosList[0].location);
    tsOrder.getTosList()[0].setAddress(this.order.tosList[0].address);

    tsOrder.setType(this.order.type);
    tsOrder.setFee(this.order.fee);

    tsOrder.setStart(new Timestamp());
    tsOrder.getStart().setSeconds(this.order.start.seconds);
    tsOrder.setComment(this.order.comment);
    tsOrder.setPayinfo(payInfo);
    apiService.ordersClient.add(tsOrder, apiService.metaData,
      (err: grpcWeb.Error, response: Order) => {
        if (err) {
          utilService.alert(err.message);
        }
        console.log(response);
        this.modalController.dismiss();
      });
  }
}
