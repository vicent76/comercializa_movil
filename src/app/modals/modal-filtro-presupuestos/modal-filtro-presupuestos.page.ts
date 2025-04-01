import { Component, OnInit, ViewChild } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';;
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ComercializaService } from 'src/app/services/comercializa.service';
import * as moment from 'moment'

@Component({
  selector: 'app-modal-filtro-presupuestos',
  templateUrl: './modal-filtro-presupuestos.page.html',
  styleUrls: ['./modal-filtro-presupuestos.page.scss'],
})
export class ModalFiltroPresupuestosPage implements OnInit {

  @ViewChild('filtro', { static: true })
  filtroFrm!: NgForm;

  busqueda: any =  {
    fecha: null,
    hFecha: null,
    direccionTrabajo: null
  }

  mostrarDatetime = false;
  fechaFormateada: any = null; 

  mostrarDatetime2 = false;
  fechaFormateada2: any= null; 



  constructor(
    private uiService: UiService,
    private modalCtrl: ModalController,
    private comercializaService: ComercializaService
  ) { }

  async ngOnInit() {
    try{
     const datos = await this.comercializaService.getFiltroPresupuesto();
     if(datos) {
       this.busqueda = datos;
       this.fechaFormateada = this.formatDate(moment(this.busqueda.fecha).format('YYYY-MM-DD'));
       this.fechaFormateada2 = this.formatDate(moment(this.busqueda.hFecha).format('YYYY-MM-DD'));
     }
    } catch(error) {
     this.uiService.controlDeError(error);
    }
     //this.comercializaService.borrarFiltroPresupuesto();
   }
 
   async dismiss() {
     try {
       await this.modalCtrl.dismiss();
     }catch(error) {
       this.uiService.controlDeError(error);
     }
   }

   async borrarFiltros() {
    await this.comercializaService.borrarFiltroPresupuesto();
    this.busqueda.fecha = null;
    this.busqueda.hFecha = null;
    this.busqueda.direccionTrabajo = null;
    this.fechaFormateada = null;
    this.fechaFormateada2 = null;

   }
 
   async filtrarPresupuestos() {
    /*  if(!this.busqueda.fecha &&  !this.busqueda.hFecha && !this.busqueda.direccionTrabajo) {
       await this.uiService.alertaInformativa('No se ha introducido nada');
       return;
     } */
     if(this.busqueda.hFecha && !this.busqueda.fecha) {
       await this.uiService.alertaInformativa('Debe introducir una fecha de inicio si introduce otra de final.');
       return;
     }

     if(this.busqueda.direccionTrabajo == '') this.busqueda.direccionTrabajo = null;
 
     if(this.busqueda.fecha)  this.busqueda.fecha = moment(this.busqueda.fecha).format('YYYY-MM-DD');
     
 
     if(this.busqueda.hFecha) this.busqueda.hFecha = moment(this.busqueda.hFecha).format('YYYY-MM-DD');
    
     var data = { 
      
         fecha: this.busqueda.fecha,
         hFecha: this.busqueda.hFecha,
         direccionTrabajo: this.busqueda.direccionTrabajo
     }
     try {
       await this.modalCtrl.dismiss(data);
     }catch(error) {
       this.uiService.controlDeError(error);
     }
   }
   

   formatDate(date: string) {
    const a = moment(new Date(date)).format('DD/MM/YYYY');
    return a;
  }

  async showDatepicker() {
     if(!this.mostrarDatetime) {
       this.mostrarDatetime = true;
     } else {
       this.closeDatetime("fechaFormat");
     }
   
  }

  async showDatepicker2() {
   
     if(!this.mostrarDatetime2) {
       this.mostrarDatetime2 = true;
     } else {
       this.closeDatetime("fechaFormat2");
     }
 
  }
  
  onDateChange(event: any) {
    // Maneja el cambio de fecha
    let e = null;
    let selectedDate = null;
    if(event.target)   e = event.target.id;
    if(e === "fecha") {
     selectedDate = event.detail.value;
     this.busqueda.fecha = selectedDate;
     this.fechaFormateada = moment(selectedDate).format('DD/MM/YYYY');
    } else {
     selectedDate = event.detail.value;
     this.busqueda.hfecha = selectedDate;
     this.fechaFormateada2 = moment(selectedDate).format('DD/MM/YYYY');
    }
  }

 closeDatetime(e: string | undefined) {
   if(e === "fechaFormat") {
     this.mostrarDatetime = false;
   } else {
     this.mostrarDatetime2 = false;
   }
    // Asegurar que el foco regrese al botón para evitar problemas de accesibilidad
    setTimeout(() => {
      const button = document.getElementById('openDateButton');
      if (button) {
        button.focus();
      }
    }, 100);
  }

}
