import { Component, OnInit, ViewChild } from '@angular/core';
import { ComercializaService } from 'src/app/services/comercializa.service';
import { UiService } from 'src/app/services/ui.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NgForm } from '@angular/forms';
import { NavController, ModalController } from '@ionic/angular';
import { FirmaPartePage } from '../firma-parte/firma-parte.page'
import { ActivatedRoute } from '@angular/router';
import { IonDatetime } from '@ionic/angular';

import { PresupuestoDetallePage } from '../presupuesto-detalle/presupuesto-detalle.page'

import * as moment from 'moment';

@Component({
  selector: 'app-parte-detalle',
  templateUrl: './parte-detalle.page.html',
  styleUrls: ['./parte-detalle.page.scss'],
})
export class ParteDetallePage implements OnInit {


  @ViewChild('datetime', { static: true })
  datetime: IonDatetime | undefined;

  @ViewChild('fparte', { static: true })
  userFrm!: NgForm;

  

  prueba:boolean = false;
  parte: any = {};
  parteId: any = 0;
  parteModificado: any = {
    parteId: 0,
    numParte: '',
    empresa: '',
    fecha_reparacion: null,
    descripcion_averia: '',
    trabajosPendientes : '',
    servicioId: 0,
    numServicio: 0,
    estadoParteProfesionalId: 0, 
    formaPagoCliente: '',
    estadoParteId: 2,
    proveedorId: 0,
    empresaParteId: 0,
    operadorId: 0,
    trabajos_realizados: null,
    confirmado: 0,
    observacionesDelProfesional: '',
    observacionesProfesional: '',
    email: '',
    clienteId: 0,
    porcentajeIvaCliente: 0,
    tipoIvaClienteId: 0,
    tipoGarantiaId: 0,
    direccionTrabajo: '',
    fecha_solicitud: '',
    refPresupuesto: '',
    ofertaId: 0,

    
    nombreFirmante: null,
    apellidosFirmante: null,
    dniFirmante: null,
    cargoFirmante: null,
    firma: null,
    noFirma: 0
  };
  estados: any[] = [];
  //servicio: any = {};
  tiposProfesionales: any = [];
  tiposGarantia: any = [];
  usuario: any = [];
  imagenes: any = [];
  modalFirma: any;
  confirmado: number = 0;
  submitAttempt: boolean = false;
  propagacion: boolean = false;

  modalPresupuestoDetalle: any = null
  fechaFormateada = '';


  constructor(
    private comercializaService: ComercializaService,
    private usuarioService: UsuarioService,
    private navCtrl: NavController,
    private uiService: UiService,
    private modalCtrl: ModalController,
    private route: ActivatedRoute
  ) { 
   
  }
  async ngOnInit() {
    this.propagacion = true;
    this.init(true);
  }

  
 ionViewDidEnter = async () => {
   if(this.propagacion) {
     this.propagacion = false;
   } else {
    this.init(false);
   }
  }

  formatDate(date: string) {
    const a = moment(new Date(date)).format('DD/MM/YYYY');
    this.fechaFormateada = a;
  }

  showDatepicker() {
    // Abre el selector de fecha usando el método de apertura de un botón
    // Cambia el estado para mostrar el datetime picker
    const input = document.createElement('input');
    input.setAttribute('type', 'date');
    input.style.position = 'absolute';
    input.style.opacity = '0';
    input.addEventListener('change', (event) => {
      const target = event.target as HTMLInputElement;
      if (target.value) {
        const selectedDate = new Date(target.value).toISOString();
        this.parteModificado.fecha_reparacion = selectedDate;
      }
    });
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  }
  
  onDateChange(event: CustomEvent) {
    // Maneja el cambio de fecha
    const selectedDate = event.detail.value;
    this.parteModificado.fecha_reparacion = selectedDate;
  }

  

   init = async(opcion: boolean) => {
    try {
      this.usuario = await this.usuarioService.getUsuario();
      console.log(this.usuario);
      var datos = null
      var id: any =  this.route.snapshot.paramMap.get('id');
      var id2 = parseInt(id);
      datos = await this.comercializaService.getParteDetalleObj();
      if(id2 > 0 && !datos) {
        datos  =  await this.comercializaService.getParte(id2);
        this.parte = datos;
      } else {
        this.parte = datos;
      }
     
      var cerrado = 'false';
      if(this.parte.estadoParteProfesionalId == 6 || this.parte.estadoParteProfesionalId == 2) cerrado = 'true'
      this.estados = await this.comercializaService.getEstadosParteEstado(cerrado);
      this.tiposGarantia = await this.comercializaService.getTiposGarantia();
      this.tiposProfesionales = await this.comercializaService.getTiposProfesionalesProveedor();
      
  
      
        this.confirmado = this.parte.confirmado;
        this.parteModificado.confirmado = this.parte.confirmado;
        this.imagenes = await this.comercializaService.getParteFotos(this.parte.parteId);
        this.parteModificado.parteId = this.parte.parteId;
        this.parteModificado.numParte = this.parte.numParte;
        this.parteModificado.empresa = this.parte.empresa;
        if(opcion) {
          this.parteModificado.estadoParteProfesionalId = this.parte.estadoParteProfesionalId;
          this.parteModificado.tipoGarantiaId = this.parte.tipoGarantiaId;
          if(this.parte.fecha_reparacion) {
            this.parteModificado.fecha_reparacion = this.parte.fecha_reparacion;
            this.formatDate(this.parte.fecha_reparacion);
          }
          this.parteModificado.trabajos_realizados = this.parte.trabajos_realizados;
          this.parteModificado.descripcion_averia = this.parte.descripcion_averia;
          this.parteModificado.trabajosPendientes  = this.parte.trabajosPendientes;
          this.parteModificado.observacionesDelProfesional = this.parte.observacionesDelProfesional;
        }
        
        this.parteModificado.observacionesProfesional = this.parte.observacionesProfesional;
        this.parteModificado.fecha_solicitud = this.parte.fecha_solicitud;
        this.parteModificado.formaPagoCliente = this.parte.formaPagoCliente;
        this.parteModificado.servicioId = this.parte.servicioId;
        this.parteModificado.numServicio = this.parte.numServicio;
        this.parteModificado.tipoProfesionalId = this.parte.tipoProfesionalId;
        this.parteModificado.proveedorId = this.parte.proveedorId;
        this.parteModificado.empresaParteId = this.parte.empresaParteId;
        this.parteModificado.operadorId = this.parte.operadorId;
        this.parteModificado.email = this.parte.email;
        this.parteModificado.clienteId = this.parte.clienteId;
        this.parteModificado.porcentajeIvaCliente = this.parte.porcentajeIvaCliente;
        this.parteModificado.tipoIvaClienteId = this.parte.tipoIvaClienteId;
        this.parteModificado.direccionTrabajo = this.parte.direccionTrabajo;
        this.parteModificado.refPresupuesto = this.parte.refPresupuesto;
        this.parteModificado.ofertaId = this.parte.ofertaId
       
         //
         this.parteModificado.nombreFirmante = this.parte.nombreFirmante;
         this.parteModificado.apellidosFirmante = this.parte.apellidosFirmante;
         this.parteModificado.dniFirmante = this.parte.dniFirmante;
         this.parteModificado.cargoFirmante = this.parte.cargoFirmante;
         this.parteModificado.firma = this.parte.firma;
         this.parteModificado.noFirma = this.parte.noFirma;
       
         this.comercializaService.guardarParteDetalleObj(this.parteModificado);
        
    }catch(error) {
      this.uiService.controlDeError(error);
    }
  }

  formatearFecha(fecha: string): string {
    // Asegúrate de que la fecha esté en formato ISO 8601
    return new Date(fecha).toISOString();
  }



   guardarCabeceraParte = async (fparte:NgForm) => {
    if (fparte.invalid) {
      await this.uiService.alertaInformativa('Debe rellenar los campos correctamente');
      return;
    }
    if(this.parteModificado.estadoParteProfesionalId == 2) {
      if(!this.imagenes) {
        await this.uiService.alertaInformativa('Para cerrar el parte es obligatorio que haya al menos una imagen.');
        return;
      } 
    } 

    if(this.parteModificado.estadoParteProfesionalId == 0) {
      await this.uiService.alertaInformativa('Debe rellenar los campos correctamente');
      return;
    }
         //formateamos la fecha para la base de datos

    var fecha_reparacion: any =  moment(this.parteModificado.fecha_reparacion).format('YYYY-MM-DD');
    if(fecha_reparacion == 'Invalid date') fecha_reparacion = null;


   
    var data = {
      parte: {
        parteId: 0,
        fecha_reparacion: fecha_reparacion,
        descripcion_averia: this.parteModificado.descripcion_averia,
        trabajosPendientes : this.parteModificado.trabajosPendientes ,
        servicioId: this.parte.servicioId,
        estadoParteProfesionalId: this.parteModificado.estadoParteProfesionalId, 
        proveedorId: this.parteModificado.proveedorId,
        empresaParteId: this.parteModificado.empresaParteId,
        estadoParteId: this.parteModificado.estadoParteId,
        trabajos_realizados: this.parteModificado.trabajos_realizados,
        observacionesDelProfesional: this.parteModificado.observacionesDelProfesional,
        tipoGarantiaId: this.parteModificado.tipoGarantiaId
      }
    }
    if(this.parteModificado.parteId) {
      var id = this.parteModificado.parteId
      data.parte.parteId = this.parte.parteId
      try {
        await this.comercializaService.putParte(id, data);
        this.uiService.presentToast('Parte modificado correctamente');
        this.comercializaService.guardarParteDetalleObj(this.parteModificado);
        if(this.parteModificado.estadoParteProfesionalId != 2) {
          this.navCtrl.navigateForward("tabs-parte/parte-tab/" + 0);
        } else {
          this.navCtrl.navigateForward("/partes/" + this.parteModificado.parteId);
        }
        return;
      } catch (error: any) {
        if (error.status == 401) {
          this.uiService.alertaInformativa('Error al crear el parte');
          return;
        }
        this.uiService.controlDeError(error);
        return;
      }
    }
  }

  companyFormSelected(newform: any) {
    console.log(newform)
    /* let selectedForm = this.forms.find((f)=>{
      return f.id === newform;
    });
    this.company.form=selectedForm; */
}

cancelar = async() => {
  this.navCtrl.navigateForward("/partes/" + this.parte.parteId);
}

openModalFirma = async () => {
    this.modalFirma = await this.modalCtrl.create({
      component: FirmaPartePage
    });

    this.modalFirma.onDidDismiss()
    .then((data: any) => {
      
  });
    return await this.modalFirma.present();
}

submit() {
  this.guardarCabeceraParte(this.userFrm);
}

 openFrmPresupuesto = async () => {
  this.modalPresupuestoDetalle = await this.modalCtrl.create({
    component: PresupuestoDetallePage,
  });

  this.modalPresupuestoDetalle.onDidDismiss()
  .then((data: any) => {
   this.init(false)
  });

  return await this.modalPresupuestoDetalle.present();
}

  
}
