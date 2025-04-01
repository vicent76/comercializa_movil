import { Component, OnInit } from '@angular/core';
import { ComercializaService } from 'src/app/services/comercializa.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UiService } from 'src/app/services/ui.service';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment'


@Component({
  selector: 'app-notificacion-detalle',
  templateUrl: './notificacion-detalle.page.html',
  styleUrls: ['./notificacion-detalle.page.scss'],
})
export class NotificacionDetallePage implements OnInit {
  mensaje: any = {};
  usuario: any = {};

  constructor(
    private comercializaService: ComercializaService,
    private navCtrl: NavController,
    private uiService: UiService,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute
  ) { }

  async ngOnInit() {
    var data = {}
    this.mensaje =  this.comercializaService.getMensajeDetalleObj();
    this.usuario = await this.usuarioService.getUsuario();
    //se actuliza como leido
    if(!this.mensaje) {
      try {
        var id: any =  this.route.snapshot.paramMap.get('id');
        var id2 = parseInt(id);
        this.mensaje =  await this.comercializaService.getNotificacion(id2);
       

        this.mensaje.fechaFormat = moment( this.mensaje.fecha).format('DD-MM-YYYY');
      } catch(error) {
        this.uiService.controlDeError(error);
      }
  
    } 
    //actualizamos el estado
    data = {
      mensaje: {
        estado: 'LEIDO',
        mensajeId: this.mensaje.mensajeId,
        proveedorId: this.usuario.usuarioId
      }
    }
    try {
      await this.comercializaService.putEstadoPush( this.mensaje.mensajeId,  this.usuario.usuarioId, data);
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

  async salir() {
    this.comercializaService.borrarMensajeDetalleObj();
    this.navCtrl.navigateForward("/notificaciones");
  }

}
