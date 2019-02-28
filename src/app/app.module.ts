import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy, IonSlides } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { Contacts } from '@ionic-native/contacts/ngx';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ModalComponent } from './modal/map/modal.component';
import { OrderComponent } from './modal/order/order.component';

@NgModule({
  declarations: [AppComponent, ModalComponent, OrderComponent],
  entryComponents: [ModalComponent, OrderComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    QRScanner,
    Contacts,
    Camera,
    IonSlides,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
