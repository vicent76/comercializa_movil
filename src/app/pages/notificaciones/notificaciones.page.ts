import { Component, OnInit } from '@angular/core';
import { ComercializaService } from 'src/app/services/comercializa.service';
import { UiService } from 'src/app/services/ui.service';
import { NavController } from '@ionic/angular';
import * as moment from 'moment';


@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.page.html',
  styleUrls: ['./notificaciones.page.scss'],
})
export class NotificacionesPage implements OnInit {

  notificaciones: any[] = [];
  notificacioneSelect: any = 0;
  
  
  constructor(
    private comercializaService: ComercializaService,
    private uiService: UiService,
    private navCtrl: NavController
  ) { }
  
  
  async ngOnInit() {
    try {
        const respuesta = await this.comercializaService.getNotificacionesUsuarioPush();
        this.notificaciones = respuesta;
      
      this.notificaciones.forEach(s => {
        s.presupuestoText = null;
        s.urgenteText = null;
        s.fechalecFormat = moment(s.fechalec).format('DD-MM-YYYY');
        s.fechaFormat = moment(s.fecha).format('DD-MM-YYYY');
        if(s.presupuesto == 1)  s.presupuestoText = "PRESUPUESTO";
        if(s.urgente == 1)  s.urgenteText = "URGENTE";
      });

      
    } catch (error: any) {
      this.uiService.controlDeError(error);
    }
  }

    
  async ionViewWillEnter() {
    try {
        const respuesta = await this.comercializaService.getNotificacionesUsuarioPush();
        this.notificaciones = respuesta;
      
      this.notificaciones.forEach(s => {
        s.presupuestoText = null;
        s.urgenteText = null;
        s.fechalecFormat = moment(s.fechalec).format('DD-MM-YYYY');
        s.fechaFormat = moment(s.fecha).format('DD-MM-YYYY');
        if(s.presupuesto == 1)  s.presupuestoText = "PRESUPUESTO";
        if(s.urgente == 1)  s.urgenteText = "URGENTE";
      });

      
    } catch (error: any) {
      this.uiService.controlDeError(error);
    }
  }

 /*  async ionViewWillEnter() {
    try {
      this.notificacioneSelect  = this.route.snapshot.paramMap.get('id');
      this.check = await this.comercializaService.getEstadoCheck();
      if(this.check) {
        const respuesta = await this.comercializaService.getnotificacionesAbiertos(this.check.estado);
        this.notificaciones = respuesta;
      } else {
        this.check = {
          estado: false
        }
        await this.comercializaService.guardarEstadoCheck(this.check);
        const respuesta = await this.comercializaService.getnotificacionesAbiertos(false);
        this.notificaciones = respuesta;
      }

      this.notificaciones.forEach(s => {
        s.fechaEntradaFormat = moment(s.fechaEntrada).format('DD-MM-YYYY');
      });
      
    } catch (error: any) {
      this.uiService.controlDeError(error);
    }
  }
 */
  async mostrarDetalle (mensaje: any) {
    const espera = this.uiService.iniciarEspera();
    try {
      const mensajeDetalle = await this.comercializaService.getNotificacion(mensaje.mensajeId);
      (await espera).dismiss();
      if (!mensajeDetalle) {
        this.uiService.alertaInformativa('Notificacion no encontrada');
        return;
      }
      mensajeDetalle.fechaFormat = moment(mensajeDetalle.fecha).format('DD-MM-YYYY');
      mensajeDetalle.presupuestoText = mensaje.presupuestoText;
      mensajeDetalle.urgenteText = mensaje.urgenteText;
      this.comercializaService.guardarMensajeDetalleObj(mensajeDetalle);
      this.navCtrl.navigateForward('/notificacion-detalle/0');
    } catch (error: any) {
      (await espera).dismiss();
      if (error.status === 500) {
        this.uiService.controlDeError(error);      
      } else {
        this.uiService.alertaInformativa(error.error);
      }
    }
  }

}
