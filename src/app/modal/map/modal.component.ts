import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

declare var AMap;
declare var AMapUI;

@Component({
  selector: 'app-model',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @ViewChild('map_container') map_container: ElementRef;
  map: any; // 地图对象
  currentPosition: any;
  pois: any[]

  constructor(
    private sanitizer: DomSanitizer,
    private modalController: ModalController) {
    //this.iframe = this.sanitizer.bypassSecurityTrustResourceUrl('https://m.amap.com/picker/?key=60d396703bef1a6a93d2eca45a70e764');
  }

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
      mapStyle: 'amap://styles/macaron',
    });
    this.map.panBy(0, 1);
    AMap.plugin('AMap.ToolBar', () => {
      this.map.addControl(new AMap.ToolBar({
        liteStyle: true
      }))
    });

    AMapUI.loadUI(['misc/PositionPicker', 'misc/PoiPicker'], (PositionPicker, PoiPicker) => {
      var positionPicker = new PositionPicker({
        mode: 'dragMap',//设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
        map: this.map//依赖地图对象
      });
      const marker = new AMap.Marker({
        map: this.map,
      });
      //TODO:事件绑定、结果处理等
      positionPicker.on('success', (positionResult) => {
        console.log(positionResult);
        this.pois = positionResult.regeocode.pois;

        this.currentPosition = {
          'name': positionResult.nearestPOI,
          'address': positionResult.address,
          'location': positionResult.position.P + ',' + positionResult.position.O
        }

        const positionInfo = [positionResult.position.P + '', positionResult.position.O + ''];
        marker.setPosition(positionInfo);
        marker.setLabel({
          offset: new AMap.Pixel(-80, -40), // 修改label相对于marker的位置
          content: '<strong>' + positionResult.address + '</strong><br/>·' + positionResult.nearestRoad,
        });
      });
      positionPicker.on('fail', (positionResult) => {
        console.log(positionResult);
      });
      positionPicker.start();

      var poiPicker = new PoiPicker({
        input: 'search',
        placeSearchOptions: {
          map: this.map,
          pageSize: 6 //关联搜索分页
        }

      });
      poiPicker.on('poiPicked', (poiResult) => {
        console.log(poiResult);
        let lat = poiResult.item.location.lat
        let lng = poiResult.item.location.lng
        this.map.panTo([lng, lat]);
      });
    });

    AMap.plugin('AMap.Geolocation', () => {
      let geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,//是否使用高精度定位，默认:true
        timeout: 10000,          //超过10秒后停止定位，默认：无穷大
        maximumAge: 0,           //定位结果缓存0毫秒，默认：0
        showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
        showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
        panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
        zoomToAccuracy: true      //定位成功后调整地图视野范围使定位位置及精度范围视野s内可见，默认：false
      });
      this.map.addControl(geolocation);
      geolocation.getCurrentPosition();
    });
    // AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息

    // const cw = this.map_container.nativeElement.contentWindow;
    // this.map_container.nativeElement.onload = function () {
    //   cw.postMessage('hello', 'https://m.amap.com/picker/');
    // };
    // window.addEventListener('message', (e) => {
    //   console.log(e.data);
    //   this.modalController.dismiss(e.data);
    // }, false);
  }

  confirmPosition() {
    this.modalController.dismiss(this.currentPosition);
  }
}
