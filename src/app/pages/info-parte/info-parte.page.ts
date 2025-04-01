import { Component, OnInit } from '@angular/core';
import { ComercializaService } from 'src/app/services/comercializa.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UiService } from 'src/app/services/ui.service';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
import * as moment from 'moment';


@Component({
  selector: 'app-info-parte',
  templateUrl: './info-parte.page.html',
  styleUrls: ['./info-parte.page.scss'],
})
export class InfoPartePage implements OnInit {

 localesAfectados: any = [];
 usuario: any = {};
 parte: any = {}
  parteModificado: any = {
    parteId: 0,
    numParte: '',
    empresa: '',
    descripcion_averia: '',
    formaPagoCliente: '',
    confirmado: 0,
    observacionesProfesional: '',
    direccionTrabajo: '',
    fecha_solicitud: ''
  };

  constructor(
    private comercializaService: ComercializaService,
    private usuarioService: UsuarioService,
    private navCtrl: NavController,
    private uiService: UiService,
    private route: ActivatedRoute,
    private callNumber: CallNumber
  ) { }

  async ngOnInit() {
    let parteId = 0;
    let espera = null;
    try {
      this.usuario = await this.usuarioService.getUsuario();
      var id: any =  this.route.snapshot.paramMap.get('id');
      var id2 = parseInt(id);
      this.parte = this.comercializaService.getParteDetalleObj();
      if(id2 == 0) {
        espera = this.uiService.iniciarEspera();
        parteId = this.parte.parteId;
        this.parteModificado.fechaSolicitudFormat = moment( this.parte.fecha_solicitud).format('DD-MM-YYYY');
        this.localesAfectados = await this.comercializaService.getLocalesAfectadosServicioParte(this.parte.servicioId, parteId);
        this.comercializaService.guardarParteDetalleObj(this.parte);
        (await espera).dismiss(); 
      } else {
        espera = this.uiService.iniciarEspera();
        this.parte =  await this.comercializaService.getParte(id2);
        this.parteModificado.fechaSolicitudFormat = moment( this.parte.fecha_solicitud).format('DD-MM-YYYY');
        parteId = this.parte.parteId;
        this.localesAfectados = await this.comercializaService.getLocalesAfectadosServicioParte(this.parte.servicioId, parteId);
        this.comercializaService.guardarParteDetalleObj(this.parte);
        (await espera).dismiss(); 
      }

      this.parteModificado.numParte = this.parte.numParte;
      this.parteModificado.empresa = this.parte.empresa;
      this.parteModificado.descripcion_averia = this.parte.descripcion_averia;
      this.parteModificado.observacionesProfesional = this.parte.observacionesProfesional;
      this.parteModificado.fecha_solicitud = this.parte.fecha_solicitud;
      this.parteModificado.formaPagoCliente = this.parte.formaPagoCliente;
      this.parteModificado.direccionTrabajo = this.parte.direccionTrabajo;
      this.parteModificado.confirmado = this.parte.confirmado;
       
        
    }catch(error) {
      if(espera) (await espera).dismiss(); 
      this.uiService.controlDeError(error);
    }
  }

  async aceptar() {
    var parteId = this.parte.parteId
    var data = {
      parte: {
        parteId: parteId,
        confirmado: 1
      }
    }
    /* var data2 = {
      parte: {
        parteId: parteId,
        proveedorId: this.usuario.usuarioId,
        estadoParteProfesionalId: 1,
        tipoProfesionalId: this.parte.tipoProfesionalId
      }
    } */

    var data3 = {
      datos: {
        parteId: parteId,
        servicioId: this.parte.servicioId,
        proveedorId: this.usuario.usuarioId,
        proveedorNombre: this.usuario.nomusu,
        numParte: this.parte.numParte,
        opcion: true,
        empresa: this.parte.usuario,
        direccionTrabajo: this.parte.direccionTrabajo,
        email: this.parte.email
      }
    }

    try {
      await this.comercializaService.putParte(parteId, data);
      //await this.comercializaService.putParteSinAsignar(servicioId, data2);
      await this.comercializaService.sendNotificacionWeb(data3);
      await this.comercializaService.enviarCorreo(data3);
  
      this.uiService.presentToast('Se ha aceptado el parte');
      this.comercializaService.borrarParteDetalleObj();
      this.navCtrl.navigateForward("/partes/" + parteId);
    } catch (error: any) {
      this.uiService.controlDeError(error);
    }
  }

  async rechazar() {
    var parteId = this.parte.parteId;
    var data = {
      parte: {
        parteId: parteId,
        confirmado: 2
      }
    }
    var data2 = {
      datos: {
        parteId: parteId,
        servicioId: this.parte.servicioId,
        proveedorId: this.usuario.usuarioId,
        proveedorNombre: this.usuario.nomusu,
        numParte: this.parte.numParte,
        opcion: false,
        empresa: this.parte.usuario,
        direccionTrabajo: this.parte.direccionTrabajo,
        email: this.parte.email
      }
    }
    try {
      await this.comercializaService.putParte(parteId, data);
      this.comercializaService.borrarParteDetalleObj();
      await this.comercializaService.sendNotificacionWeb(data2);
     
      await this.comercializaService.enviarCorreo(data2);
      this.uiService.presentToast('Se ha rechazado el parte');
      this.navCtrl.navigateForward("/partes/0");
    } catch (error: any) {
      this.uiService.controlDeError(error);
    }
  }

  async cancelar() {
    try {
      this.comercializaService.borrarParteDetalleObj();
      this.navCtrl.navigateForward("/partes/" + this.parte.parteId);
    } catch(error) {
      this.uiService.controlDeError(error);
    }
  }

  call(event: any) {
    try {
      var telefono = event.currentTarget.outerText
      this.callNumber.callNumber(telefono, true);
    } catch(error) {
      console.log(error);
    }
  }


}
