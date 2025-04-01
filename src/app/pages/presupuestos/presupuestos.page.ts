import { Component, OnInit } from '@angular/core';
import { ComercializaService } from 'src/app/services/comercializa.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NavController, ModalController } from '@ionic/angular';
import { UiService } from 'src/app/services/ui.service';
import { ActivatedRoute } from '@angular/router';
import { ModalFiltroPresupuestosPage } from '../../modals/modal-filtro-presupuestos/modal-filtro-presupuestos.page';
import { PresupuestoDetallePage } from '../presupuesto-detalle/presupuesto-detalle.page'
import * as moment from 'moment';


@Component({
  selector: 'app-presupuestos',
  templateUrl: './presupuestos.page.html',
  styleUrls: ['./presupuestos.page.scss'],
})
export class PresupuestosPage implements OnInit {
  servicio: any = {};
  usuario: any = {};
  presupuestos: any[] = [];
  presupuestoSelect: any = 0;
  modalFiltroPage: any;
  datos:any = null;
  modalPresupuestoDetalle: any = null;

  estados: any = [
    {
      estadoId: 1,
      nombre: "Todos"

    },
    {
      estadoId: 2,
      nombre: "Enviado"

    },
    {
      estadoId: 3,
      nombre: "Pendiente de enviar"

    },
    {
      estadoId: 4,
      nombre: "Asignado"

    }
  ]

  estadoId: number = this.estados[0].estadoId; //valor por defecto

  constructor(
    private comercializaService: ComercializaService,
    private usuarioService: UsuarioService,
    private navCtrl: NavController,
    private uiService: UiService,
    private route: ActivatedRoute,
    private modalCtrl: ModalController
  ) { }

  async ngOnInit() {
    
  }

  async ionViewWillEnter() {
    try {
      
      this.comercializaService.borrarParteDetalleObj();
      this.usuario = await this.usuarioService.getUsuario();
      this.datos = await this.comercializaService.getFiltroPresupuesto();
      this.presupuestoSelect  = this.route.snapshot.paramMap.get('id');
      //this.comercializaService.borrarPresupuestoDetalleObj();

      this.mostrarPresupuestos();
  
    } catch (error: any) {
      this.uiService.controlDeError(error);
    }
  }

  async mostrarPresupuestos () {
    var fecha = null;
    var hFecha = null;
    var direccionTrabajo = null;
   
    if(this.datos) {
      fecha = this.datos.fecha;
      hFecha = this.datos.hFecha,
      direccionTrabajo = this.datos.direccionTrabajo
    }

    const espera = this.uiService.iniciarEspera();
    try {
      this.presupuestos = await this.comercializaService.getPresupuestosProveedor(this.usuario.usuarioId, this.estadoId, fecha, hFecha, direccionTrabajo);
      (await espera).dismiss();
      if (!this.presupuestos) {
        this.uiService.alertaInformativa('Presupuestos no encontrados');
        return;
      } else {
        this.presupuestos.forEach(p => {
          p.fechaOfertaFormat = moment(p.fechaOferta).format('DD-MM-YYYY');
        });
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



  async editarPresupuesto(presupuesto: any) {
    try{
      if(presupuesto.ofertaId) {
        this.comercializaService.guardarPresupuestoDetalleObj(presupuesto);
        this.openFrmPresupuesto();
        //this.navCtrl.navigateRoot("presupuesto-detalle/" + presupuesto.ofertaId);
      }  else {
        this.navCtrl.navigateForward("presupuesto-detalle/" + 0);
      }
    }catch(e) {
      console.log(e);
    }
  }



  async selected(event: any) {
    this.mostrarPresupuestos()
  }

  async openModalFiltro() {
    this.modalFiltroPage = await this.modalCtrl.create({
      component: ModalFiltroPresupuestosPage,
      componentProps: { data: Object },
    });

    this.modalFiltroPage.onDidDismiss()
    .then((data: any) => {
      const datos = data['data'];
      if(datos) {
        this.comercializaService.guardarFiltroPresupuesto(datos);
        this.datos = datos;
        this.mostrarPresupuestos();
      }
  });
    return await this.modalFiltroPage.present();
  }

  async openFrmPresupuesto() {
    this.modalPresupuestoDetalle = await this.modalCtrl.create({
      component: PresupuestoDetallePage,
    });
  
    this.modalPresupuestoDetalle.onDidDismiss()
    .then((data: any) => {
      this.comercializaService.borrarParteDetalleObj();
      this.presupuestoSelect  = data.data;
      //this.comercializaService.borrarPresupuestoDetalleObj();

      this.mostrarPresupuestos();
  
     
    });
  
    return await this.modalPresupuestoDetalle.present();
  }

}
