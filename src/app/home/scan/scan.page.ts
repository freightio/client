import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.page.html',
  styleUrls: ['./scan.page.scss'],
})
export class ScanPage implements OnInit {

  constructor(
    private qrScanner: QRScanner,
    private router: Router) { }

  ngOnInit() {
    this.scanQR();
  }

  scanQR() {
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          let scanSub = this.qrScanner.scan().subscribe((text: string) => {
            console.log('Scanned something', text);
            alert(text);
            this.qrScanner.hide(); // hide camera preview
            scanSub.unsubscribe(); // stop scanning
            this.router.navigateByUrl('/home');
          });

          this.qrScanner.show();
        } else {
          alert("请允许访问摄像头!");
        }
      }).catch((e: any) => {
        console.log('Error is', e);
      });
  }

  toggleLight() {
    this.qrScanner.getStatus().then((status: QRScannerStatus) => {
      if (status.lightEnabled) {
        this.qrScanner.disableLight();
      } else {
        this.qrScanner.enableLight();
      }
    });
  }

  /**
   * 前后摄像头互换
   */
  toggleCamera() {
    this.qrScanner.getStatus().then((status: QRScannerStatus) => {
      if (status.currentCamera == 0) {
        this.qrScanner.useFrontCamera();
      } else {
        this.qrScanner.useBackCamera();
      }
    });
  }
}
