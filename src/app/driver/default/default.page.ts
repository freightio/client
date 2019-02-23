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
      //resizeEnable: true,
      //rotateEnable: true,
      //pitchEnable: true,
      zoom: 11,
      //pitch: 80,
      //rotation: -15,
      viewMode: '2D',//开启3D视图,默认为关闭
      buildingAnimation: true,//楼块出现是否带动画
      showBuildingBlock: true,
      expandZoomRange: true,
      //zooms: [3, 20],
      //center: [116.333926, 39.997245]
    });
    AMap.plugin('AMap.ToolBar', () => {
      var toolbar = new AMap.ToolBar();
      this.map.addControl(toolbar);
    });
    this.getLocation();
  }

  getLocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      alert(resp.coords);
      AMap.service('AMap.Geocoder', () => {
        AMap.convertFrom(resp.coords.longitude + "," + resp.coords.latitude, "gps",
          (status0, result0) => {
            if (status0 == "complete") {
              alert(result0.locations[0]);
              var toLng = result0.locations[0].O;
              var toLat = result0.locations[0].P;
              console.log(toLng, toLat);
              //transform=true;
              const positionInfo = [toLng + '', toLat + ''];
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

            } else {
              console.log(status + "/" + result0);
              alert("获取位置失败,请重试");
            }
          });



      });

    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }
}
