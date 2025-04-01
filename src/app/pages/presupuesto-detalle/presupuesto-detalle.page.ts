import { Component, OnInit, ViewChild } from '@angular/core';
import { ComercializaService } from 'src/app/services/comercializa.service';
import { UiService } from 'src/app/services/ui.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ParametrosService } from 'src/app/services/parametros.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { NavController, ModalController, AlertController, Platform } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { PresupuestoTrabajoDetallePage } from '../../modals/presupuesto-trabajo-detalle/presupuesto-trabajo-detalle.page';

import * as moment from 'moment';

interface Oferta {
  ofertaId?: string;
  tipoOfertaId?: number;
  referencia?: string;
  tipoProyectoId?: number;
  empresaId?: string;
  clienteId?: string;
  agenteId?: string;
  fechaOferta?: string;
  coste?: number;
  porcentajeBeneficio?: number;
  importeBeneficio?: number;
  ventaNeta?: number;
  porcentajeAgente?: number;
  importeAgente?: number;
  importeCliente?: number;
  rappelAgente?: number;
  formaPagoId?: number;
  creadaApp?: boolean;
  parteId?: string;
  estadoParteProfesionalId?: number;
}




// Definir tipo para data
type OfertaPartial = Partial<Oferta>;



@Component({
  selector: 'app-presupuesto-detalle',
  templateUrl: './presupuesto-detalle.page.html',
  styleUrls: ['./presupuesto-detalle.page.scss'],
})
export class PresupuestoDetallePage implements OnInit {



  oferta: any = {
    ofertaId: 0,
    clienteId: 0,
    nombreCliente: "",
    empresa: "",
    empresaId: 0,
    referencia: "",
    fechaOferta: this.formatDate(moment(new Date()).format('YYYY-MM-DD')),
    tipoProyectoId: 71,
    nombreDepartamento: "Reparaciones",
    departamentoId: 7,
    nombreAgente: "",
    agenteId: 0,
    rappelAgente: 0,
    nombreFormaPago: "",
    formaPagoId: 0,
    importePofesional: 0,
    creadaApp: 1,
    email: "",
    parteId: 0
  }


  //calculo del descuento
  descuento: number = 0;
  descuentoUnitarioPro: number = 0;
  importeproveedorDescuento: number = 0;
  totales: number = 0;
  indice: number = 0;
  //
  descuentoCliente: number = 0;
  descuentoUnitarioCli: number = 0;
  importeClienteDescuento: number = 0;

  //variables para guardar los calculos del descuento formatesdos a dos decimales
  descuentoFormat: number = 0;
  importeproveedorDescuentoFormat: number = 0;
  totalesFormat: number = 0;
  indiceFormat: any = 0;
  totSinDescuento: any = 0

  //
  params: any = {};
  usuario: any = {};
  empresa: any = {};
  parte: any = {};
  fechaOferta: any = this.formatDate(moment(new Date()).format('YYYY-MM-DD'));
  cliente: any = {};
  tiposProyectos: any = [];
  tipoProyectoId: number = 0; 
  //trabajos
  trabajos: any = [];
  importeClienteTotal: number = 0;
  importeClienteIvaTotal: number = 0;
  clienteIvaTotal: number = 0;
  modalPresupuestoTrabajoDetalle: any;
  datosCargados: boolean = false;
  rappelAgente: number = 0
  indices: any = [];
  datos: any = null;
  estadoParteProfesionalId: number = 0;
  tipoProfesionalId: number = 0;
  isMobilePlatform: boolean = false;

  mostrarDatetime = false;
  fechaFormateada = '';
 


  constructor(
    private comercializaService: ComercializaService,
    private usuarioService: UsuarioService,
    private parametrosService: ParametrosService,
    private empresaService: EmpresaService,
    private navCtrl: NavController,
    private uiService: UiService,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private platform: Platform
  ) { 
   
  }

  async ngOnInit() {
    this.isMobilePlatform = this.platform.is('android') || this.platform.is('ios');
  }

  async ionViewDidEnter() {
    try {
      this.usuario = await this.usuarioService.getUsuario()
      this.params = await this.parametrosService.recuperaParametros();
      this.empresa = await this.empresaService.getEmpresa();
      this.datos = null
      let presupuesto = null;
    
      this.datos = await this.comercializaService.getParteDetalleObj(); 

   


      //PARTIMOS DEL DETALLE DE UN PARTE Y BUSCAMOS SU PRESUPUESTO ASOCIADO
      if(this.datos) {
          this.estadoParteProfesionalId = this.datos.estadoParteProfesionalId;
          this.tipoProfesionalId = this.datos.tipoProfesionalId;
           //buscamos primero si ya existe un presupuesto asociado a este parte
           if(this.datos.refPresupuesto && this.datos.refPresupuesto != '' && this.datos.ofertaId) {
            let d = {};
            if(this.datos) {
              let d = {
                datos: {
                  ref: this.datos.refPresupuesto,
                  clienteId: this.datos.clienteId,
                  ofertaId: this.datos.ofertaId
                }
              }
              presupuesto = await this.comercializaService.getPresupuestoParte(d);
              presupuesto.parteId = this.datos.parteId;
              presupuesto.tipoProfesionalId = this.datos.tipoProfesionalId;
            }
          }
      }
     
     
      if(!presupuesto) { //NO HAY PRESUPUESTO ASOCIADO AL PARTE O VENIMOS DEL GRID DE OFERTAS
        if(this.datos) { // es un POST
          //console.log(JSON.stringify(this.datos));
          var clienteId = this.datos.clienteId;
          this.cliente = await this.comercializaService.getDatosCliente(clienteId);
          await this.cargarTiposProyecto(0);
          this.datos.departamentoId = this.datos.tipoProyectoId;
          await this.cargarRappelAgente(this.datos);
          this.oferta.empresaId =  this.datos.empresaParteId;
          await this.cargaDatosOferta(this.datos, this.cliente);
          if(this.oferta.ofertaId) {
            await this.mostrarTrabajos(false);
          }
          this.nuevaRefReparaciones();
          this.datosCargados = true;
        } else  { // es un PUT
          this.oferta = await this.comercializaService.getPresupuestoDetalleObj();
          this.oferta.departamentoId = this.oferta.tipoOfertaId;
          var clienteId = this.oferta.clienteId;
          this.rappelAgente = this.oferta.rappelAgente;
          this.oferta.empresaId =  this.oferta.empresaId;
          this.estadoParteProfesionalId = this.oferta.estadoParteProfesionalId;
          this.tipoProfesionalId = this.oferta.tipoProfesionalId;
          this.cliente = await this.comercializaService.getDatosCliente(clienteId);
          
          await this.cargarTiposProyecto(this.oferta.tipoProyectoId);
          await this.cargaDatosOferta(this.oferta, this.cliente);
          //await this.cargarRappelAgente(this.cliente.comercialId)
          if(this.oferta.ofertaId) {
            await this.mostrarTrabajos(false);
          }
          this.datosCargados = true;
        }
      }
      else {  //Si el parte tiene presupuesto asociado lo cargamos
        this.oferta = presupuesto;
        this.oferta.departamentoId = this.oferta.tipoOfertaId;
        var clienteId = this.oferta.clienteId;
        this.rappelAgente = this.oferta.rappelAgente;
        this.oferta.empresaId =  this.oferta.empresaId;
        //this.oferta.tipoProfesionalId = this.datos.tipoProfesionalId;
        this.cliente = await this.comercializaService.getDatosCliente(clienteId);
        
        await this.cargarTiposProyecto(this.oferta.tipoProyectoId);
        await this.cargaDatosOferta(this.oferta, this.cliente);

        if(this.oferta.ofertaId) {
          await this.mostrarTrabajos(false);
        }
        this.datosCargados = true;
      }
      
    } catch(error) {
      this.uiService.controlDeError(error);
    }
  }

  async cargaDatosOferta(p: any, c: any) {
      this.oferta.nombreCliente =  c.nombre;
      this.oferta.clienteId = c.clienteId;
      this.oferta.agenteId =  c.comercialId;
      this.oferta.nombreAgente =  c.nombreAgente;
      this.oferta.nombreFormaPago =  "";
      this.oferta.formaPagoId =  c.formaPagoId;
      this.oferta.importePofesional =  0;
      this.oferta.empresa = p.empresa;
      this.oferta.parteId = p.parteId;
      this.oferta.email = p.email;
      this.fechaFormateada =  moment(p.fechaOferta).format('DD/MM/YYYY')
      this.oferta.fechaOferta = p.fechaOferta
  }

  async cargarTiposProyecto(id: number) {
    try {
        this.tiposProyectos = await this.comercializaService.getTiposProyecto(this.usuario.usuarioId, this.oferta.departamentoId, true);

        // Si deseas establecer un valor por defecto, puedes hacerlo aquí después de que los datos se hayan cargado
      // Por ejemplo, establecer el primer tipo de proyecto como valor por defecto
      if (this.tiposProyectos.length > 0) {
        if(id) {
          const tipoProyectoEncontrado = this.tiposProyectos.find((tipoProyecto: any) => tipoProyecto.tipoProyectoId === id);
          if (tipoProyectoEncontrado) {
            this.tipoProyectoId = tipoProyectoEncontrado.tipoProyectoId;
            //this.oferta.tipoProyectoId = this.tipoProyectoId;
            console.log("Tipo de proyecto encontrado:", tipoProyectoEncontrado);
          } else {
            console.log("No se encontró ningún tipo de proyecto con el ID", id);
          }

        } else {
          this.tipoProyectoId = this.tiposProyectos[0].tipoProyectoId; // Esto establecerá el primer tipo de proyecto como valor por defecto
          this.oferta.tipoProyectoId = this.tipoProyectoId;
        }
      }
    } catch(error: any) {
      if(error.status == 404) return this.uiService.alertaInformativa(error.error);
      this.uiService.controlDeError(error);
    }
  }
  /* buscarTipoProyectoPorId(id: number) {
    return this.tiposProyectos.find((tipoProyecto: any) => tipoProyecto.tipoProyectoId === id);
  } */
  

  async cargarRappelAgente(datos: any) {
    try {
      let agenteId = this.cliente.comercialId;
      let clienteId = datos.clienteId;
      let empresaId = datos.empresaParteId;
      let departamentoId = this.oferta.departamentoId;
        let rappelAgente = await this.comercializaService.getRappelAgente(agenteId, clienteId, empresaId, departamentoId);

      if (rappelAgente) {
        this.oferta.rappelAgente = rappelAgente; 
      } else {
        this.oferta.rappelAgente = 0;
      }
    } catch(error) {
      this.uiService.controlDeError(error);
    }
  }

  
  async nuevaRefReparaciones() {
   let a = new Date()
   let n = ""
     n = moment(a).format('YYYY-MM-DD');
     this.oferta.fechaOferta = n;
    let fecha =  n;
    let ano = null;
    let f = null;
    let emp = this.oferta.empresaId;
    let rap = this.oferta.rappelAgente
    if(fecha) {
        f = new Date(fecha);
        ano = f.getFullYear();

    }
      if(!rap) this.oferta.rappelAgente = 0;
      if(!ano || !emp) return;
 
   
        if(emp == 2 || emp == 3 || emp == 7) {
          this.oferta.referencia = await this.comercializaService.obtenerReferencia(emp, rap, ano);
    }
}




  async guardarOferta(salir: boolean, datos2: any) {
   
    let data: { oferta: OfertaPartial } = {
      oferta: {
        ofertaId: this.oferta.ofertaId,
        tipoOfertaId: 7,
        referencia: this.oferta.referencia,
        tipoProyectoId: this.oferta.tipoProyectoId,
        empresaId: this.oferta.empresaId,
        clienteId: this.oferta.clienteId,
        agenteId: this.oferta.agenteId,
        fechaOferta: this.oferta.fechaOferta,
        coste: 0,
        porcentajeBeneficio: 0,
        importeBeneficio: 0,
        ventaNeta: 0,
        porcentajeAgente: 0,
        importeAgente: 0,
        importeCliente: 0,
        rappelAgente: this.oferta.rappelAgente,
        formaPagoId: this.oferta.formaPagoId,
        creadaApp: this.oferta.creadaApp,
        parteId: this.oferta.parteId,
        estadoParteProfesionalId: 4 // al crear por defecto el estado del parte asociado
      }
    };
  
    
     try {
       if(!this.oferta.ofertaId) {
              const alert = await this.alertController.create({
                header: 'ATENCIÓN',
                message: "Se va a crear la oferta,¿Está seguro que quiere continuar?",
                buttons: [
                  {
                    text: 'Cancelar',
                    role: 'cancel',
                    handler: dato => {
                      //no hacemos nada
                    }
                  },
                  {
                    text: 'Aceptar',
                    handler: dato => { 
                      this.postOferta(data)
                    }
                  }
                      
                ],
                animated: true
              });

              await alert.present();
        } else {
           this.putOferta(data, datos2, salir);
        }
      } catch(error) {
        this.uiService.controlDeError(error);
      }
  }

  async postOferta(data: { oferta: any; }) {
    const espera = this.uiService.iniciarEspera();
    let oferta = await this.comercializaService.postOferta(data);
        (await espera).dismiss();
        await this.uiService.alertaInformativa('Oferta creada correctamente, puede crear los trabajos con el botón +');
        this.oferta.ofertaId = oferta.ofertaId;
      
        if(this.datos) {//estamos operando dentro del detalle del parte, guardamos la modificación en la cooky
          this.datos.refPresupuesto = this.oferta.referencia;
          this.datos.ofertaId = oferta.ofertaId;
          this.comercializaService.guardarParteDetalleObj(this.datos);
        }
    
  }

  async putOferta(data: { oferta: any; }, datos2: object, salir: boolean) {
    try {
      const espera = this.uiService.iniciarEspera();
      //eliminamos los campos que no se titnene que actializar
      delete data.oferta.coste;
      delete data.oferta.ventaNeta;
      delete data.oferta.importeCliente;
      (await espera).dismiss();
      if(!salir) {//MODIFICACIÓN DE LA OFERTA
        delete data.oferta.parteId;
        delete data.oferta.estadoParteProfesionalId;
        let oferta = await this.comercializaService.putOferta(data, this.oferta.ofertaId);
        await this.uiService.alertaInformativa('Oferta modificada correctamente.');
        await this.mostrarTrabajos(false);
      } else {//ENVIO DE OFERTA PARA ESTUDIO
        data.oferta.estadoParteProfesionalId = 9;//ESTADO DEL PARTE CUANDO LO ENVIAMOS PARA ESTUDIO
        let oferta = await this.comercializaService.putOfertaActualizaParte(data, this.oferta.ofertaId);
        if(this.datos) {//estamos operando dentro del detalle del parte, guardamos la modificación en la cooky
          this.datos.estadoParteProfesionalId = 9;
          this.comercializaService.guardarParteDetalleObj(this.datos);
        }
        if(this.oferta.email == '' || !this.oferta.email) {
          this.uiService.alertaInformativa("No hay una direccion de correo configurada, no se ha podido notificar a administración");
        } else {
          if(datos2) {
            await this.comercializaService.enviarCorreoGeneral(datos2);
            await this.uiService.alertaInformativa('Oferta enviada correctamente.');
          } else {
            this.uiService.alertaInformativa("No hay una direccion de correo configurada, no se ha podido notificar a administración");
          }
        }
        this.dismiss()
        }
    } catch(e) {
      this.uiService.controlDeError(e)
    }
        
    
  }

  async editarTrabajo(trabajo: any) {
    this.comercializaService.guardarPresupuestoTrabajoDetalleObj(trabajo);
    this.modalPresupuestoTrabajoDetalle = await this.modalCtrl.create({
      component: PresupuestoTrabajoDetallePage,
      componentProps: { data: { ofertaId: this.oferta.ofertaId,  ref: this.oferta.referencia, proveedorId: this.usuario.usuarioId } }
    });

    this.modalPresupuestoTrabajoDetalle.onDidDismiss()
    .then((data: any) => {
      if(data.data == 'OK') {
        this.mostrarTrabajos(true);
      } else {
        this.mostrarTrabajos(false);
      }
  });
    return await this.modalPresupuestoTrabajoDetalle.present();
  }

  async crearTrabajo() {
    this.comercializaService.borrarPresupuestoTrabajoDetalleObj();
    this.modalPresupuestoTrabajoDetalle = await this.modalCtrl.create({
      component: PresupuestoTrabajoDetallePage,
      componentProps: { data: { ofertaId: this.oferta.ofertaId,  ref: this.oferta.referencia, proveedorId: this.usuario.usuarioId  } }
    });

    this.modalPresupuestoTrabajoDetalle.onDidDismiss()
    .then((data: any) => {
      this.mostrarTrabajos(true);
    });

    return await this.modalPresupuestoTrabajoDetalle.present();
  }

  async mostrarTrabajos(modificacion: boolean) {
    let t = this.oferta.ofertaId;
    let p = this.usuario.usuarioId;
      try {
        this.trabajos = await this.comercializaService.getTrabajos(t, p);
        if(this.trabajos.length > 0) {
          //si hay trabajos buscamos los indices correctores
          //para aplicar descuento si procede
          let profesionalId = this.usuario.usuarioId;
          //this.tipoProfesionalId = this.oferta.tipoProfesionalId;
          //obtenemos los totales del proveedor
          let tot = 0;
          for(let t of this.trabajos) {
            tot += parseFloat(t.importeProveedor);
          }
          this.totalesFormat = Math.round(tot * 100) / 100;
          
          if(modificacion) {
            this.buscarIndicesCorrectores(profesionalId, this.tipoProfesionalId)
          } else {
            this.getTrabajosShowDescuentos()
          }
        } else {
          this.totalesFormat = 0;
        }
      } catch (error: any) {
        if (error.status === 500) {
          this.uiService.controlDeError(error);      
        } else {
          this.uiService.alertaInformativa(error.error);
        }
      }
  }
  
  async borrarTrabajo(trabajo: any) {
    let data = {
      ofertaLinea: {
        ofertaId: trabajo.ofertaId
      }
    }
  
    const espera = this.uiService.iniciarEspera();
    try {
      await this.comercializaService.deleteOfertaLinea(trabajo.ofertaLineaId, data);
      (await espera).dismiss();
      this.uiService.alertaInformativa('Trabajo borrado correctamnente');
      this.mostrarTrabajos(true);
      
    } catch (error: any) {
      (await espera).dismiss();
      if (error.status === 500) {
        this.uiService.controlDeError(error);      
      } else {
        this.uiService.alertaInformativa(error.error);
      }
    }
  }

  async selected() {
    await this.msjEnviarPresupuesto("Se va a enviar el presupuesto para su estudio.\n una vez echo no se podrá modificar.\n¿Esta seguro que desea realizar esta acción?");  
  }

  async msjEnviarPresupuesto( message: string) {
    const alert = await this.alertController.create({
      header: 'ATENCIÓN',
      message,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: data => {
            //no hacemos nada
          }
        },
        {
          text: 'Aceptar',
          handler: data => { 
            let datos = {
              datos: {
                ofertaId: this.oferta.ofertaId,
                proveedorId: this.usuario.usuarioId,
                proveedorNombre: this.usuario.nomusu,
                referencia: this.oferta.referencia,
                email: this.oferta.email
              }
            }
            this.guardarOferta(true, datos);
          }
        }
            
      ],
      animated: true
    });

    await alert.present();
  }

  async buscarIndicesCorrectores(proveedorId: number, tipoProfesionalId: number) {
    this.indices = await this.comercializaService.getIndicesCorrectoresProfesional(proveedorId, tipoProfesionalId);
    if(this.indices.length > 0) this.calculaIndices()
  }

  async calculaIndices() {
    try {
    //primero sumamos los totales de todos los trabajos
    this.totales = 0;
    this.indice = 0;
    for(let t of this.trabajos) {
      this.totales += parseFloat(t.importeProveedor);
    }
    this.totales = parseFloat(this.totales.toFixed(2));
    //Ahora aplicamos el indice correspondiente
    for(let i of this.indices) {
      let min = parseFloat(i.minimo);
      let max = parseFloat(i.maximo);
      if(this.totales >= min && this.totales <= max) {
        this.indice = parseFloat(i.porcentajeDescuento) / 100;
        break;
      }
    }
    //si hay indice se aplica el descuento
    //if(this.indice > 0) {
      for(let t of this.trabajos) {
        //primero lo calculamos por linea y actualizamos en la base de datos
        //PROVEEDOR
        this.descuentoUnitarioPro = t.precioProveedor * this.indice;

        this.importeproveedorDescuento = t.precioProveedor - this.descuentoUnitarioPro;
        this.importeproveedorDescuento = Math.round(this.importeproveedorDescuento * 100) / 100;
        this.importeproveedorDescuento = Math.round((this.importeproveedorDescuento * t.unidades) * 100) / 100;
        //this.importeproveedorDescuento = Math.round(this.importeproveedorDescuento * 100) / 100;

        this.descuento = Math.round((t.importeProveedor - this.importeproveedorDescuento) * 100) / 100; //cantidad de descuento
      
        //CLIENTE
        this.descuentoUnitarioCli = t.precioCliente * this.indice;

        this.importeClienteDescuento = t.precioCliente - this.descuentoUnitarioCli;
        this.importeClienteDescuento = Math.round(this.importeClienteDescuento * 100) / 100;
        this.importeClienteDescuento = Math.round((this.importeClienteDescuento * t.unidades) * 100) / 100;


        this.descuentoCliente = Math.round((t.importeCliente - this.importeClienteDescuento) * 100) / 100; //cantidad de descuento

       let i = this.indice * 100;
        let data = {
          ofertaLinea: {
            ofertaId: t.ofertaId,
            ofertaLineaId: t.ofertaLineaId,
            linea: t.linea,
            articuloId: t.articuloId,
            tipoIvaId: t.tipoIvaClienteId,
            porcentaje: t.ivaCliente,
            descripcion: t.descripcion,
            cantidad: t.unidades,
            importe: t.precioCliente,
            //totalLinea: t.importeCliente,
            //DESCUENTOS POVEEDOR
            perdtoProveedor: Math.round(i * 100) / 100,
            dtoProveedor: this.descuento,
            totalLineaProveedor: this.importeproveedorDescuento,
            costeLineaProveedor: this.importeproveedorDescuento,
            //DESCUENTOS CLIENTE
            perdto: Math.round(i * 100) / 100,
            dto: this.descuentoCliente,
            totalLinea: this.importeClienteDescuento,
            coste: this.importeClienteDescuento
          }
        }
        await this.comercializaService.putOfertaLinea(t.ofertaLineaId, data);
      }
      //AQUÍ BUSCAMOS LOS IMPORTES ACTUALIZADOS PARA MOSTRARLOS
      if(this.indice > 0) { 
        this.getTrabajosShowDescuentos();
      }
    //}

    } catch(error) {
      this.uiService.controlDeError(error);
    }
   
  }

  async getTrabajosShowDescuentos()  {
    let t = this.oferta.ofertaId;
    let p = this.usuario.usuarioId;
    let totales = 0;
    let descuento = 0;
    let importeproveedorDescuento = 0;
    let indiceDistinto = false;
    let antIndice = 0;
    let tra = await this.comercializaService.getTrabajos(t, p);
    for(let t of tra) {
      if(antIndice) {
        if(antIndice != t.perdtoProveedor) indiceDistinto = true;//hay porcentajes de descuento al proveedor diferentes en los trabajos 
      }
      totales = totales + parseFloat(t.importeProveedor);
      descuento = descuento + parseFloat(t.dtoProveedor);
      importeproveedorDescuento = importeproveedorDescuento + parseFloat(t.costeLineaProveedor);
      antIndice = t.perdtoProveedor;
    }
    //formateamos los valores con coma decimal para mostrarlos
    if(!this.indice) {
      this.indice = parseFloat(this.trabajos[0].perdtoProveedor);
      this.indiceFormat = Math.round(this.indice * 100) / 100;
      if(indiceDistinto) this.indiceFormat = '';

    } else {
      let i = this.indice * 100;
      this.indiceFormat = (Math.round(i * 100) / 100);
    }
    //this.totalesFormat = Math.round(totales * 100) / 100; 
    
    this.descuentoFormat = Math.round(descuento * 100) / 100;
    this.importeproveedorDescuentoFormat = Math.round(importeproveedorDescuento * 100) / 100;
    this.totSinDescuento = this.totalesFormat
    this.totalesFormat = this.importeproveedorDescuentoFormat;
  }

  async crearDescargarMrt() {
    const espera = this.uiService.iniciarEspera();
    try {
      let data = {
        datos: {
          ofertaId: this.oferta.ofertaId,  
          referencia: this.oferta.referencia, 
          proveedorId: this.usuario.usuarioId, 
          departamentoId: this.oferta.departamentoId,  
          codigo: this.empresa.codigo
        }
      }
      let datos = await this.comercializaService.crearMrt(data);
      let result = await this.comercializaService.descargaPdf(datos);
      if(result === 'OK') this.uiService.presentToast('Descarga correcta');
      (await espera).dismiss();

    } catch(error) {
      (await espera).dismiss();
      this.uiService.controlDeError(error);
    }
  }

  async dismiss() {
    let data =  this.oferta.ofertaId;
    await this.modalCtrl.dismiss(data);
    }
  
    formatDate(date: string) {
      const a = moment(new Date(date)).format('DD/MM/YYYY');
      this.fechaFormateada = a;
    }

    showDatepicker() {
      if(!this.mostrarDatetime) {
        this.mostrarDatetime = true;
      } else {
        this.closeDatetime();
      }
      
    }
    
    onDateChange(event: CustomEvent) {
      // Maneja el cambio de fecha
      const selectedDate = event.detail.value;
      this.oferta.fechaOferta = selectedDate;
      this.fechaFormateada = moment(selectedDate).format('DD/MM/YYYY');
      //this.closeDatetime();
    }

    closeDatetime() {
      this.mostrarDatetime = false;
      
      // Asegurar que el foco regrese al botón para evitar problemas de accesibilidad
      setTimeout(() => {
        const button = document.getElementById('openDateButton');
        if (button) {
          button.focus();
        }
      }, 100);
    }
    
}

