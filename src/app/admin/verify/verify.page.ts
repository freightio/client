import * as grpcWeb from 'grpc-web';
import { Component, OnInit } from '@angular/core';
import { Certification } from '../../../sdk/user_pb';
import { apiService } from '../../providers/util.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.page.html',
  styleUrls: ['./verify.page.scss'],
})
export class VerifyPage implements OnInit {
  certificationsAdmin = [];

  constructor() { }

  ngOnInit() {
    var j = 0;
    let certAdmin = new Certification();
    certAdmin.setStatus('new');
    let streamAdmin = apiService.certificationsClient.list(certAdmin, apiService.metaData);
    streamAdmin.on('data', response => {
      this.certificationsAdmin[j] = response.toObject();
      j++;
    });
  }

  pass(certification) {
    if (window.confirm('审核通过?')) {
      let tsCertification = new Certification();
      tsCertification.setId(certification.id);
      tsCertification.setStatus('pass');
      apiService.certificationsClient.update(tsCertification, apiService.metaData, (err: grpcWeb.Error, response: Certification) => {
        if (err) {
          alert(JSON.stringify(err));
        } else {
          //refresh
          this.certificationsAdmin = [];
          this.ngOnInit();
        }
      });
    }
  }
}
