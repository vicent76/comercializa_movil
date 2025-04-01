import { Component, OnInit } from '@angular/core';
import { ComercializaService } from 'src/app/services/comercializa.service';
import { UiService } from 'src/app/services/ui.service';
import { NavController, ModalController } from '@ionic/angular';
import { TrabajoDetallePage } from '../../modals/trabajo-detalle/trabajo-detalle.page'
import * as moment from 'moment';
import * as numeral from 'numeral';

@Component({
  selector: 'app-trabajos',
  templateUrl: './trabajos.page.html',
  styleUrls: ['./trabajos.page.scss'],
})
export class TrabajosPage implements OnInit {

  parte: any = {};
  trabajos: any[] = [];
  modalTrabajosDetalle: any;
  importeClienteTotal: any = 0;
  importeClienteIvaTotal: any = 0;
  clienteIvaTotal: any = 0

  constructor(
    private comercializaService: ComercializaService,
    private navCtrl: NavController,
    private uiService: UiService,
    private modalCtrl: ModalController
  
  ) { }
  async ngOnInit() {
    this.parte = this.comercializaService.getParteDetalleObj();
    if(this.parte) {
      this.mostrarTrabajos();
    } 
  }

  async ionViewWillEnter() {
    this.parte = this.comercializaService.getParteDetalleObj();
    if(this.parte) {
      this.mostrarTrabajos();
    } 
  }

  async mostrarTrabajos () {
    const espera = this.uiService.iniciarEspera();
    this.importeClienteTotal = 0;
    this.importeClienteIvaTotal = 0;
    this.clienteIvaTotal = 0;
    try {
      this.trabajos = await this.comercializaService.getTrabajosParte(this.parte.parteId);
      (await espera).dismiss();
      if (this.trabajos.length == 0) {
        //this.uiService.alertaInformativa('trabajos no encontrados');
        return;
      } else {
        this.trabajos.forEach(p => {
          p.fechaSolicitudFormat = moment(p.fecha_solicitud).format('DD-MM-YYYY');
          p.fechaPrevistadFormat = moment(p.fecha_prevista).format('DD-MM-YYYY');
          this.importeClienteTotal = this.importeClienteTotal + p.importeCliente;
          this.importeClienteIvaTotal = this.importeClienteIvaTotal + p.importeClienteIva;
          this.clienteIvaTotal = this.clienteIvaTotal + p.totalClienteIva;
        });
        this.importeClienteTotal = numeral(this.importeClienteTotal).format('0,0.00');
        this.importeClienteIvaTotal = numeral(this.importeClienteIvaTotal).format('0,0.00');
        this.clienteIvaTotal = numeral(this.clienteIvaTotal).format('0,0.00');
       
      }
    } catch (error: any) {
      (await espera).dismiss();
      if (error.status === 500) {
        this.uiService.controlDeError(error);      
      } else {
        this.uiService.alertaInformativa(error.error);
      }
    }
  }

  async editarTrabajo(trabajo: any) {
    this.comercializaService.guardarTrabajoDetalleObj(trabajo);
    this.modalTrabajosDetalle = await this.modalCtrl.create({
      component: TrabajoDetallePage
    });

    this.modalTrabajosDetalle.onDidDismiss()
    .then((data: any) => {
      this.mostrarTrabajos();
  });
    return await this.modalTrabajosDetalle.present();
  }

  async crearTrabajo() {
    this.comercializaService.borrarTrabajoDetalleObj();
    this.modalTrabajosDetalle = await this.modalCtrl.create({
      component: TrabajoDetallePage
    });

    this.modalTrabajosDetalle.onDidDismiss()
    .then((data: any) => {
      this.mostrarTrabajos();
    });

    return await this.modalTrabajosDetalle.present();
  }
  
  async borrarTrabajo(trabajo: any) {
    const espera = this.uiService.iniciarEspera();
    try {
      await this.comercializaService.deleteTrabajo(trabajo.parteLineaId, trabajo.parteId, this.parte.servicioId);
      (await espera).dismiss();
      this.uiService.alertaInformativa('Trabajo borrado correctamnente');
      this.mostrarTrabajos();
      
    } catch (error:any) {
      (await espera).dismiss();
      if (error.status === 500) {
        this.uiService.controlDeError(error);      
      } else {
        this.uiService.alertaInformativa(error.error);
      }
    }
  }

  }
