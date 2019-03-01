import { Component, OnInit } from '@angular/core';
import * as grpcWeb from 'grpc-web';
import { Account } from '../../sdk/wallet_pb';
import { utilService, apiService } from '../providers/util.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {
  account: any;

  constructor() {
    this.account = {};
  }

  ngOnInit() {
    let account = new Account();
    account.setUserid(utilService.getUser().id);
    apiService.walletsClient.total(account, apiService.metaData, (err: grpcWeb.Error,
      response: Account) => {
      if (err) {
        console.log(err);
      }
      if (response.toObject()) {
        this.account.fee = (<any>response.toObject()).fee.toFixed(2);
      } else {
        this.account.fee = '0.00';
      }
    });
  }

}
