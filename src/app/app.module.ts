import { NgModule, LOCALE_ID } from '@angular/core';
import es from '@angular/common/locales/es';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';

import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage-angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ComponentsModule } from './components/components.module';

import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { WebView } from '@awesome-cordova-plugins/ionic-webview/ngx';
import { registerLocaleData } from '@angular/common';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { Clipboard } from '@awesome-cordova-plugins/clipboard/ngx';

//import { FooterComponent } from './components/footer/footer.component';


registerLocaleData(es);



@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    ComponentsModule,
    HttpClientModule,
    IonicStorageModule.forRoot()
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'es-ES' },
    AppVersion,
    AndroidPermissions,
    CallNumber,
    Camera,
    WebView,
    File,
    Clipboard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
