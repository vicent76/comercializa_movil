import { Component, NgZone } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';

/* declare global {
  interface Window {
    handleOpenURL: (url: string) => void;
  }
} */

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private navCtrl: NavController,
    private zone: NgZone
  ) {
    this.platform.ready().then(() => {
      // Manejar la URL cuando la app se abre vía deep link
     /*  window.handleOpenURL = (url: string) => {
        console.log('Deep link recibido:', url);
        this.zone.run(() => {
          this.handleDeepLink(url);
        });
      }; */

      this.initializeApp();
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

 /*  handleDeepLink(url: string) {
    // Quita el esquema y la parte 'open/'
    const path = url.replace('comercializa2://open/', '');

    if (path.startsWith('tabs-parte/info-parte-tab/')) {
      const parteId = path.split('/')[2];
      console.log('Navegando a parteId:', parteId);
      this.navCtrl.navigateForward(`tabs-parte/info-parte-tab/${parteId}`);

    } else if (path.startsWith('notificacion-detalle/')) {
      const mensajeId = path.split('/')[1];
      console.log('Navegando a notificación:', mensajeId);
      this.navCtrl.navigateForward(`notificacion-detalle/${mensajeId}`);

    } else {
      console.warn('Ruta desconocida en deep link:', path);
      this.navCtrl.navigateRoot('/');
    }
  } */
}
