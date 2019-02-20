import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';

declare var AMap;

@Component({
  selector: 'app-default',
  templateUrl: './default.page.html',
  styleUrls: ['./default.page.scss'],
})
export class DefaultPage implements OnInit {
  @ViewChild('map_container') map_container: ElementRef;
  map: any; // 地图对象

  constructor(private geolocation: Geolocation) { }

  ngOnInit() {
    this.map = new AMap.Map(this.map_container.nativeElement, {
      resizeEnable: true,
      rotateEnable: true,
      pitchEnable: true,
      zoom: 17,
      //pitch: 80,
      //rotation: -15,
      viewMode: '2D',//开启3D视图,默认为关闭
      buildingAnimation: true,//楼块出现是否带动画
      expandZoomRange: true,
      zooms: [3, 20],
      center: [116.333926, 39.997245]
    });
    AMap.plugin('AMap.ToolBar', () => {
      var toolbar = new AMap.ToolBar();
      this.map.addControl(toolbar);
    });
    this.getLocation();
  }

  getLocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      AMap.service('AMap.Geocoder', () => {
        const positionInfo = [resp.coords.longitude + '', resp.coords.latitude + ''];
        this.map.setCenter(positionInfo);

        const geocoder = new AMap.Geocoder({});
        geocoder.getAddress(positionInfo, (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            const marker = new AMap.Marker({
              map: this.map,
              position: positionInfo
            });
            marker.setLabel({
              offset: new AMap.Pixel(20, 20), // 修改label相对于maker的位置
              content: result.regeocode.formattedAddress
            });
          } else {
            console.log('获取地址失败');
          }
        });
      });

    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }
}
