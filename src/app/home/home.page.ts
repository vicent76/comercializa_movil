import { Component, OnInit, NgZone } from '@angular/core';
import { UiService } from '../services/ui.service';
import { ParametrosService } from '../services/parametros.service';
import { ComercializaService } from '../services/comercializa.service';
import { Platform, NavController } from '@ionic/angular';
import { UsuarioService } from '../services/usuario.service';
import { EmpresaService } from '../services/empresa.service';
import OneSignal from 'onesignal-cordova-plugin';

declare global {
  interface Window {
    handleOpenURL: (url: string) => void;
  }
}


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  params: any = {};
  usuario: any = {};
  empresa: any = {};
  recargarNotificaciones = false;

  constructor(
    private uiService: UiService,
    private parametrosService: ParametrosService,
    private comercializaService: ComercializaService,
    private plt: Platform,
    private usuariosService: UsuarioService,
    private empresaService: EmpresaService,
    private navCtrl: NavController,
    private zone: NgZone
  ) {

    this.plt.ready().then(() => {
      // Manejar la URL cuando la app se abre vía deep link
      window.handleOpenURL = (url: string) => {
        console.log('Deep link recibido:', url);
        this.zone.run(() => {
          this.handleDeepLink(url);
        });
      };
    });
  }

  async ngOnInit() {
    try {
      await this.comercializaService.borrarFiltroParte();
      await this.comercializaService.borrarFiltroPresupuesto();
      this.usuario = await this.usuariosService.getUsuario()
      this.params = await this.parametrosService.recuperaParametros();
      this.empresa = await this.empresaService.getEmpresa();
      if (this.params && this.usuario) {
        try {
          this.OneSignalInit(this.params.appId);
          //this.guardarUsuarioLocal();
        } catch (e) {
          console.log(e);
        }
      }

    } catch (error) {
      this.uiService.controlDeError(error);
    }
  }

  async ionViewWillEnter() {
    try {
      this.recargarNotificaciones = true; // Cambia la bandera
      this.comercializaService.borrarFiltroParte();
      await this.comercializaService.borrarFiltroPresupuesto();
      this.usuario = await this.usuariosService.getUsuario()
      this.params = await this.parametrosService.recuperaParametros();
      this.empresa = await this.empresaService.getEmpresa();
      if (this.params && this.usuario) {
        try {
          this.OneSignalInit(this.params.appId);
          //this.guardarUsuarioLocal();
        } catch (e) {
          console.log(e);
        }
      }

    } catch (error) {
      this.uiService.controlDeError(error);
    }
  }




  OneSignalInit(appId: string): void {
    this.plt.ready().then(async () => {
      try {

        // Initialize OneSignal with your appId
        OneSignal.initialize(appId);


        // Listener para notificaciones abiertas
        OneSignal.Notifications.addEventListener('click', (event) => {
          this.handleNotificationClick(event.notification);
        });



        try {
          let userId = null;
          setTimeout(async () => {
            try {
              var myUser = this.usuario;
              const userId = await OneSignal.User.pushSubscription.getIdAsync();
              if (myUser.playerId != userId) {
                myUser.playerId = userId;
                this.usuariosService.putUsuarioPush(myUser.usuarioId, myUser)
                  .then((data: any) => {
                    this.usuario.playerId = data.playerId;
                    this.guardarUsuarioLocal()
                  },
                    (error: any) => {
                      this.uiService.controlDeError(error);
                    });
              }
            } catch (e) {
              this.uiService.controlDeError(e);
            }
          }, 3000)

        } catch (e) {
          this.uiService.controlDeError(e);
        }
      } catch (e) {
        console.error('OneSignal initialization failed', e);
      }
    });
  }

  guardarUsuarioLocal() {
    this.usuariosService.guardarUsuarioLocal(this.usuario)
      .then((data: any) => {
        //this.uiService.alertaInformativa(data.playerId  + ' playerId-Guardado');
      },
        (error: any) => {
          this.uiService.controlDeError(error);
        })
  }

  async ActulizaEstadoMensaje(mensId: any) {
    //actualizamos el estado
    var data = {
      mensaje: {
        estado: 'LEIDO',
        mensajeId: mensId,
        proveedorId: this.usuario.usuarioId
      }
    }
    try {
      await this.comercializaService.putEstadoPush(mensId, this.usuario.usuarioId, data);
      return;
    } catch (error: any) {
      if (error.status == 401) {
        this.uiService.alertaInformativa('Error Actualizar el estado del mensaje');
        return;
      }
      this.uiService.controlDeError(error);
      return;
    }

  }

  async ActulizaEstadoMensajeParte(parteId: any) {
    //this.uiService.controlDeError("SENDER");
    var data = {
      mensaje: {
        estado: 'LEIDO',
        parteId: parteId,
        proveedorId: this.usuario.usuarioId
      }
    }
    try {
      await this.comercializaService.putEstadoPushParte(parteId, this.usuario.proveedorUsuarioPushId, data);
      return;
    } catch (error: any) {
      if (error.status == 401) {
        this.uiService.alertaInformativa('Error Actualizar el estado del mensaje');
        return;
      }
      this.uiService.controlDeError(error);
      return;
    }

  }


  handleNotificationClick(notification: any) {

    const additionalData = notification.additionalData;
    const mensId = additionalData["mensajeId"];
    const parteId = additionalData["parteId"];

    if (parteId) {
      this.navCtrl.navigateForward("tabs-parte/info-parte-tab/" + parteId);
      this.ActulizaEstadoMensaje(mensId);
    } else {
      this.navCtrl.navigateForward("notificacion-detalle/" + mensId);
    }
  }

  handleDeepLink(url: string) {
    // Quita el esquema y la parte 'open/'
    const path = url.replace('comercializa2://open/', '');

    if (path.startsWith('tabs-parte/info-parte-tab/')) {
      const parts = path.split('/');
      const parteId = parts[2];
      const proveedorId = parts[3]; // <--- aquí extraemos el proveedorId
      if (proveedorId != this.usuario.usuarioId) {
        return;
      } else {
        console.log('Navegando a parteId:', parteId);
        //this.uiService.controlDeError('HANDLER');
        this.ActulizaEstadoMensajeParte(parteId);
        this.navCtrl.navigateForward(`tabs-parte/info-parte-tab/${parteId}`);
      }
    } else if (path.startsWith('notificacion-detalle/')) {
      const mensajeId = path.split('/')[1];
      console.log('Navegando a notificación:', mensajeId);
      this.navCtrl.navigateForward(`notificacion-detalle/${mensajeId}`);

    } else {
      console.warn('Ruta desconocida en deep link:', path);
      this.navCtrl.navigateRoot('/');
    }
  }
}

