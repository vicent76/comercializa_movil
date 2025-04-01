import { Component, OnInit } from '@angular/core';
import { ComercializaService } from 'src/app/services/comercializa.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NavController, ModalController } from '@ionic/angular';
import { UiService } from 'src/app/services/ui.service';
import { ActivatedRoute } from '@angular/router';
import { ModalFiltroPage } from '../../modals/modal-filtro/modal-filtro.page'
import * as moment from 'moment';


@Component({
  selector: 'app-partes',
  templateUrl: './partes.page.html',
  styleUrls: ['./partes.page.scss'],
})
export class PartesPage implements OnInit {

  servicio: any = {};
  usuario: any = {};
  partes: any[] = [];
  parteSelect: any = 0;
  estado:boolean = false
  modalFiltroPage: any;
  datos:any = null;
 

  constructor(
    private comercializaService: ComercializaService,
    private usuarioService: UsuarioService,
    private navCtrl: NavController,
    private uiService: UiService,
    private route: ActivatedRoute,
    private modalCtrl: ModalController
  ) { }

  async ngOnInit() {
    try {
      this.usuario = await this.usuarioService.getUsuario();
      this.estado = await this.comercializaService.getEstadoCheck();
      this.datos = await this.comercializaService.getFiltroParte();
      this.parteSelect  = this.route.snapshot.paramMap.get('id');
      this.comercializaService.borrarParteDetalleObj();

      if(this.estado) {

      } else {
      
          this.estado = false
        
        await this.comercializaService.guardarEstadoCheck(this.estado);

      }
      this.mostrarPartes();

    } catch (error: any) {
      this.uiService.controlDeError(error);
    }
  
  }

  async ionViewWillEnter() {
    try {
      this.usuario = await this.usuarioService.getUsuario();
      this.estado = await this.comercializaService.getEstadoCheck();
      this.datos = await this.comercializaService.getFiltroParte();
      this.parteSelect  = this.route.snapshot.paramMap.get('id');
      this.comercializaService.borrarParteDetalleObj();
     
      if(this.estado) {

      } else {
        
          this.estado = false
        
        await this.comercializaService.guardarEstadoCheck(this.estado);

      }
      this.mostrarPartes();
  
    } catch (error: any) {
      this.uiService.controlDeError(error);
    }
  }

  async mostrarPartes () {
    var fecha = null;
    var direccionTrabajo = null;
    var hFecha = null;
    let estado = this.estado;
    if(this.datos) {
      fecha = this.datos.fecha;
      hFecha = this.datos.hFecha
      direccionTrabajo = this.datos.direccionTrabajo
    }

    const espera = this.uiService.iniciarEspera();
    try {
      this.partes = await this.comercializaService.getPartesProveedor(this.usuario.usuarioId, estado, fecha, hFecha, direccionTrabajo);
      (await espera).dismiss();
      if (!this.partes) {
        this.uiService.alertaInformativa('Partes no encontrados');
        return;
      } else {
        this.partes.forEach(p => {
          p.fechaSolicitudFormat = moment(p.fecha_solicitud).format('DD-MM-YYYY');
          if(p.fecha_prevista)  p.fechaPrevistaFormat = moment(p.fecha_prevista).format('DD-MM-YYYY');
            p.fechaEntradaFormat = moment(p.fechaEntrada).format('DD-MM-YYYY');
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

  async crearParte() {
    this.navCtrl.navigateForward("tabs-parte/parte-tab/" + 0);
  }

  async editarParte(parte: any) {
    try{
      if(parte.confirmado == 1) {
        this.navCtrl.navigateForward("tabs-parte/parte-tab/" + parte.parteId);
      }  else {
        this.comercializaService.guardarParteDetalleObj(parte);
        this.navCtrl.navigateForward("tabs-parte/info-parte-tab/" + 0);
      }
    }catch(e) {
      console.log(e);
    }
  }

  async borrarParte(parte: any) {
    const espera = this.uiService.iniciarEspera();
    try {
      await this.comercializaService.deleteParte(parte.parteId);
      (await espera).dismiss();
      this.uiService.alertaInformativa('Partes borrado correctamnente');
      this.mostrarPartes();
      
    } catch (error: any) {
      (await espera).dismiss();
      if (error.status === 500) {
        this.uiService.controlDeError(error);      
      } else {
        this.uiService.alertaInformativa(error.error);
      }
    }
  }

  async selected(event: any) {
    console.log(event.target.checked);
    //guardamos el estado del check
   
      this.estado = event.target.checked
    
    await this.comercializaService.guardarEstadoCheck(this.estado);
    this.mostrarPartes()
  }

  async openModalFiltro() {
    this.modalFiltroPage = await this.modalCtrl.create({
      component: ModalFiltroPage,
      componentProps: { data: Object },
    });

    this.modalFiltroPage.onDidDismiss()
    .then((data: any) => {
      const datos = data['data'];
      if(datos) {
        this.comercializaService.guardarFiltroParte(datos);
        this.datos = datos;
        this.mostrarPartes();
      }
  });
    return await this.modalFiltroPage.present();
  }


}
