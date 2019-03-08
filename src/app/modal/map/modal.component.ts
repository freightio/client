import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalController } from '@ionic/angular';

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
  positionName: any;

  constructor(private modalController: ModalController) { }

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
    // this.map.panBy(0, 1);
    AMap.plugin('AMap.ToolBar', () => {
      this.map.addControl(new AMap.ToolBar({
        liteStyle: true,
        offset: new AMap.Pixel(0, 200),
        locate: true,
        autoPosition: true,
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
        //this.pois = positionResult.regeocode.pois;
        this.currentPosition = {
          'name': positionResult.nearestPOI,
          'address': positionResult.address,
          'location': positionResult.position.P + ',' + positionResult.position.O
        }

        const positionInfo = [positionResult.position.P + '', positionResult.position.O + ''];
        marker.setPosition(positionInfo);
        marker.setLabel({
          offset: new AMap.Pixel(-80, -40), // 修改label相对于marker的位置
          content: '<strong>' + positionResult.address + '</strong>',
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

    // AMap.plugin('AMap.Geolocation', () => {
    //   let geolocation = new AMap.Geolocation({
    //     enableHighAccuracy: true,//是否使用高精度定位，默认:true
    //     timeout: 10000,          //超过10秒后停止定位，默认：无穷大
    //     maximumAge: 0,           //定位结果缓存0毫秒，默认：0
    //     showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
    //     showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
    //     panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
    //     zoomToAccuracy: true      //定位成功后调整地图视野范围使定位位置及精度范围视野s内可见，默认：false
    //   });
    //   this.map.addControl(geolocation);
    //   geolocation.getCurrentPosition();
    // });
  }

  confirmPosition() {
    this.currentPosition.name = this.positionName;
    this.modalController.dismiss(this.currentPosition);
  }
}
