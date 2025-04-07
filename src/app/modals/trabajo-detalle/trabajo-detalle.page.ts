import { Component, OnInit, ViewChild } from '@angular/core';
import { ComercializaService } from 'src/app/services/comercializa.service';
import { UiService } from 'src/app/services/ui.service';;
import { NgForm } from '@angular/forms';
import { NavController, ModalController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';

import * as moment from 'moment';
import * as numeral from 'numeral';


@Component({
  selector: 'app-trabajo-detalle',
  templateUrl: './trabajo-detalle.page.html',
  styleUrls: ['./trabajo-detalle.page.scss'],
})
export class TrabajoDetallePage implements OnInit {

  @ViewChild('ftrabajo', { static: true })
  userFrm!: NgForm;

  trabajo: any = {};
  articulo: any = {};
  trabajoModificado: any = {
    parteLineaId: 0,
    parteId: 0,
    codigoArticulo: '',
    unidades: 1,

    tipoIvaProveedorId: 0,
    procentajeIvaProveedor: 0,
    precioProveedor: 0,
    importeProveedor: 0,
    importeProveedorIva: 0,
    ivaProveedor: 0,
    aCuentaProveedor: 0,
    totalProveedorIva: 0,

    tipoIvaClienteId: 0,
    porcentajeIvaCliente: 0,
    precioCliente: 0,
    importeCliente: 0,
    importeClienteIva: 0,
    ivaCliente: 0,
    totalclienteIva: 0,


    descripcion: '',
    articulo: '',
    comentarios: '',
    tipoProfesionalId: 0,
    horaEntrada: null,
    horaSalida: null
  };
  manoObra: boolean = false;
  precioUnitarioCliente: number = 0;
  tiposProfesionales: any[] = [];
  usuario: any = {};
  modalBuscar: any;
  showArticulos: boolean = false;
  articulos: any = [];
  parte: any = {};
  tiposIva: any = []
  isDisabled: boolean = true;
  encontrado: boolean = true;
  desdeCodigo: boolean = false;
  formulario!: NgForm;
  horaE: any;
  horaS: any;
  tiempoTrabajo!: any;
  propagacion = true;

  //formateos
  precioClienteFormat: any = '';
  importeClienteFormat: any = '';
  importeClienteIvaFormat: any = '';
  ivaClienteFormat: any = ''
  totalClienteIvaFormat: any = '';

  precioProveedorFormat: any = '';
  importeProveedorFormat: any = '';

  unidadesFormat: any = '1';

  mostrarDatetime = false;
  horaEntradaFormat = ''
  mostrarDatetime2 = false;
  horaSalidaFormat = ''
  

  constructor(
    private comercializaService: ComercializaService,
    private navCtrl: NavController,
    private uiService: UiService,
    private modalCtrl: ModalController,
    private usuarioService: UsuarioService,
    ) { 
      
    }

    async ngOnInit() {
    //var datos = await this.comercializaService.getTrabajo();
    var datos =  this.comercializaService.getTrabajoDetalleObj();
    this.parte = this.comercializaService.getParteDetalleObj();
    //this.tiposProfesionales = await this.comercializaService.getTiposProfesionalesProveedor();
    this.tiposIva = await this.comercializaService.getTiposIva();
    this.usuario = await this.usuarioService.getUsuario();
    
    this.login(datos);
    if(datos) {
     
      this.trabajo = datos;
      this.trabajoModificado.parteLineaId = this.trabajo.parteLineaId,
      this.trabajoModificado.parteId = this.trabajo.parteId,
      this.trabajoModificado.codigoArticulo = this.trabajo.codigoArticulo,
      this.trabajoModificado.unidades = this.trabajo.unidades,
      this.unidadesFormat = numeral(this.trabajo.unidades).format('0,0.0');

      this.trabajoModificado.tipoIvaProveedorId = this.trabajo.tipoIvaProveedorId,
      this.trabajoModificado.precioProveedor = this.trabajo.precioProveedor,
      this.trabajoModificado.importeProveedor = this.trabajo.importeProveedor,
      this.trabajoModificado.importeProveedorIva = this.trabajo.importeProveedorIva,
      this.trabajoModificado.ivaProveedor = this.trabajo.ivaProveedor,

      this.trabajoModificado.tipoIvaClienteId = this.trabajo.tipoIvaClienteId,
      this.trabajoModificado.precioCliente = this.trabajo.precioCliente,
      this.trabajoModificado.importeCliente = this.trabajo.importeCliente,
      this.trabajoModificado.importeClienteIva = this.trabajo.importeClienteIva,
      this.trabajoModificado.ivaCliente = this.trabajo.ivaCliente,
      this.trabajoModificado.totalClienteIva = this.trabajo.totalClienteIva;

      this.trabajoModificado.descripcion = this.trabajo.descripcion,
      this.trabajoModificado.articulo = this.trabajo.nombreArticulo,
      this.trabajoModificado.comentarios = this.trabajo.comentarios;
      this.trabajoModificado.tipoProfesionalId = this.parte.tipoProfesionalId;
      this.trabajoModificado.aCuentaProveedor = this.trabajo.aCuentaProveedor;

      this.trabajoModificado.horaEntrada = this.trabajo.horaEntrada;
      this.trabajoModificado.horaSalida = this.trabajo.horaSalida;

      if(this.trabajo.horaEntrada) this.horaEntradaFormat = moment(this.trabajo.horaEntrada).format('HH:mm');
      if(this.trabajo.horaSalida) this.horaSalidaFormat = moment(this.trabajo.horaSalida).format('HH:mm');
      

      //buscamos el articulo del trabajo
      var articulos = [];
      articulos  = await  this.comercializaService.getTarifaProveedorProfesionCodigoNombre(this.parte.tipoProfesionalId, 'null', this.trabajo.codigoArticulo);
          if(articulos.length > 0) {
            this.articulo =  articulos[0];
            this.buscarPrecioUnitarioCliente();
          } else {
            throw true;
          }
    
      //buscamos la Id del iva del trabajo y extaemos el porcentaje
      for await (const i of this.tiposIva) {
        if(i.tipoIvaId ==  this.trabajo.tipoIvaProveedorId) {
          this.trabajoModificado.procentajeIvaProveedor = i.porcentaje;
          this.trabajoModificado.tipoIvaClienteId = this.parte.tipoIvaClienteId;
          this.trabajoModificado.porcentajeIvaCliente = this.parte.porcentajeIvaCliente;
        }
      }

      if(this.trabajoModificado.codigoArticulo == 900) {
        this.isDisabled = false;
      } else {
        this.isDisabled = true;
      }
      //miramos si se trata de mano de obra para activar los campos de hora
      var administracion = this.trabajo.administracion;
       if(administracion) {
         this.manoObra = true; 
       } else {
         this.manoObra = false;
       }

        /* this.formatPreciosCliente();
        this.formatPreciosProveedor(); */
        //this.formatUnidades();
      

    } else {
      this.propagacion = false;
      this.trabajoModificado.tipoProfesionalId = this.parte.tipoProfesionalId;
      this.trabajoModificado.parteId = this.parte.parteId;
      this.trabajoModificado.tipoIvaClienteId = this.parte.tipoIvaClienteId;
      this.trabajoModificado.porcentajeIvaCliente = this.parte.porcentajeIvaCliente;
    }
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.propagacion = false;
    }, 1500);
  }

  async login(datos: any) {//renovamos los parametros
    try {
      await this.usuarioService.loginUsuPush(this.usuario.usuarioLogin, this.usuario.usuarioPassword);
      this.usuario = await this.usuarioService.getUsuario(); //recuparamos los nuevos parámetros del usuario
      if(!datos) {
        this.trabajoModificado.tipoIvaProveedorId = this.usuario.tipoIvaId;
        this.trabajoModificado.procentajeIvaProveedor = this.usuario.porcentajeIva;
      }
    } catch (error:any) {
      if (error.status == 401) {
        this.uiService.alertaInformativa('Usuario y/o contraseña incorrectos');
        return;
      }
      this.uiService.controlDeError(error);
    }
  }

 
  async onChangeArticulo() {
    this.encontrado = true;
    var parArt = this.trabajoModificado.articulo;
    var cod = this.trabajoModificado.codigo;
    var tipoPro = this.parte.tipoProfesionalId;
    this.limpiarArticulo();
    if(!parArt || parArt == '') parArt = null;
      if (tipoPro) {
        //const espera = this.uiService.iniciarEspera();
        try {
          this.showArticulos = true;
          if(this.desdeCodigo) {
            this.showArticulos = false;
            this.desdeCodigo = false;
          }
          this.articulos  = await  this.comercializaService.getTarifaProveedorProfesionCodigoNombre(tipoPro, parArt, 'null');

           
          //(await espera).dismiss(); 
          if (this.articulos.length == 0) {
            this.encontrado = false
          } else {
            this.encontrado = true;
          }
           if (this.articulos.length == 1 && parArt == this.articulos[0].nombre) {
            this.showArticulos = false;
            }
             else if(this.articulos.length > 1 && parArt == this.articulos[0].nombre && this.trabajoModificado.parteLineaId != 0) {
              this.showArticulos = false;
            }
        }  catch (error: any) {
          //(await espera).dismiss(); 
          if (error.status === 500) {
            this.uiService.controlDeError(error);      
          } else {
            this.uiService.alertaInformativa(error.error);
          }
        } 
      } else {
        this.showArticulos = false;
      }
  }

  async buscarCodigo() {
    this.desdeCodigo = true;
    var cod = this.trabajoModificado.codigoArticulo;
    var tipoPro = this.parte.tipoProfesionalId;
    const espera = this.uiService.iniciarEspera();
      if(tipoPro && cod) {
        try {
          this.articulos  = await  this.comercializaService.getTarifaProveedorProfesionCodigoNombre(tipoPro, 'null', cod);
          (await espera).dismiss(); 
          if(this.articulos.length > 0) {
            this.showArticulos = false;
            this.articulo =  this.articulos[0]
            this.trabajoModificado.articulo =  this.articulo.nombre;
            this.trabajoModificado.descripcion =  this.articulo.nombre;
            if( this.articulo.codigoReparacion == 900)  this.trabajoModificado.descripcion = "";
            this.trabajoModificado.codigoArticulo =  this.articulo.codigoReparacion
            this.buscarPrecioUnitarioCliente();
           
           //miramos si se trata de mano de obra para activar los campos de hora
           var administracion = this.articulo.administracion;
            if(administracion) {
              this.manoObra = true;
              this.buscarTrabajosParte();
            } else {
              this.manoObra = false;
            }
            if(this.trabajoModificado.codigoArticulo == 900) {
              this.isDisabled = false;
            } else {
              this.isDisabled = true;
            }
          } else {
            this.uiService.alertaInformativa("Artículo no encontrado");
            return;
          }
        }  catch (error: any) {
          (await espera).dismiss();
          if (error.status === 500) {
            this.uiService.controlDeError(error);      
          } else {
            this.uiService.alertaInformativa(error);
          }
        } 
        
      } else {
        (await espera).dismiss();
      }
  }
  
  selectProveedor(proveedor: any): void {
    //this.parpro = proveedor.nomprove;
    this.showArticulos = false;
  }

  async buscarPrecioUnitarioCliente() {
     //buscamos el precio unitario del cliente
     var p = await  this.comercializaService.getPrecioUnitarioCliente(this.parte.clienteId,  this.articulo.codigoReparacion);
     if(p && p.length > 0) {
       if(p[0].precioCliente > 0 &&  this.articulo.codigoReparacion != 900) {
         this.articulo.precioUnitarioCliente =  p[0].precioCliente;
       }else {
         this.uiService.alertaInformativa("El precio unitario del artículo para este cliente es 0");
         this.articulo.precioUnitarioCliente =  0;
       }
     } else {
       if( this.articulo.codigoReparacion != 900) {
         this.uiService.alertaInformativa("El cliente no tiene el artículo incluido en su tarifa o ha habido un error al cargar los datos.");
         this.articulo.precioUnitarioCliente =  0
       }
     }
      
       this.calculaImportes();
  }

 async selectArticulo(articulo: any) {
   this.articulo = articulo;
    this.trabajoModificado.articulo = articulo.nombre;
    this.trabajoModificado.descripcion = articulo.nombre;
    if(articulo.codigoReparacion == 900)  this.trabajoModificado.descripcion = "";
    this.trabajoModificado.codigoArticulo = articulo.codigoReparacion
    this.showArticulos = false;
    this.buscarPrecioUnitarioCliente();
    //miramos si se trata de mano de obra para activar los campos de hora
    var administracion = articulo.administracion;
    if(administracion) {
      this.manoObra = true;
      this.buscarTrabajosParte();
    } else {
      this.manoObra = false;
    }
    if(this.trabajoModificado.codigoArticulo == 900) {
      this.isDisabled = false;
    } else {
      this.isDisabled = true;
    }
  }

  calculaImportes() {
    if(this.propagacion) return;
    var precioPro = 0;
    var soloIvaPro = 0;
    var ivaPro = 0;
    var articulo = null
    if(this.articulo) articulo = this.articulo;

  
    var uni = this.trabajoModificado.unidades;
    if(articulo) {
      var prePro = articulo.precioUnitario;
      var ivaProveedor = this.usuario.porcentajeIva;
      if(articulo.codigoReparacion == 900) { 
        if(this.trabajoModificado.precioProveedor) {
          prePro = this.trabajoModificado.precioProveedor;
        } else {
          return;
        }
      } 
    } else {
      var prePro = this.trabajoModificado.precioProveedor
      var ivaProveedor = this.trabajoModificado.procentajeIvaProveedor;
    }
    this.trabajoModificado.precioProveedor = prePro;
  
    if(prePro != 0) {
      precioPro = uni * prePro;
      precioPro = Math.round(precioPro * 100) / 100;
      this.trabajoModificado.importeProveedor = precioPro;
    }
    if(ivaProveedor !== 0 && prePro !== 0) {
      soloIvaPro = ((precioPro * ivaProveedor)/100);
      ivaPro = precioPro + ((precioPro * ivaProveedor)/100);
      //redondeamos a dos decimales
      soloIvaPro = Math.round(soloIvaPro * 100) / 100;
      ivaPro = Math.round(ivaPro * 100) / 100

      this.trabajoModificado.importeProveedorIva = ivaPro;
      this.trabajoModificado.ivaProveedor = soloIvaPro;
    }
   /*  this.formatPreciosProveedor(); */
    this.calculaImportesCliente();
  }


  async calculaImportesCliente() {
    if(this.propagacion) return;

    var articulo = null
    var ivaCli = 0;
    var soloIvaCli =  0;
    var precioCli = 0;
    if(this.articulo) articulo = this.articulo;
   
    try {
         var uni = this.trabajoModificado.unidades;
         var preCli = 0;
         var ivaCliente = 0;
         if(articulo) {
           if(articulo.codigoReparacion == 900) {
             preCli = (this.trabajoModificado.precioProveedor * 1.4) / 0.9
             ivaCliente = this.parte.porcentajeIvaCliente;
     
           } else {
             preCli = articulo.precioUnitarioCliente;
             ivaCliente = this.parte.porcentajeIvaCliente;
           }
         } else {
           preCli = this.trabajoModificado.precioCliente
           ivaCliente = this.trabajoModificado.porcentajeIvaCliente;
           if(this.trabajoModificado.codigoArticulo == 900) {
            preCli = (this.trabajoModificado.precioProveedor * 1.4) / 0.9
            ivaCliente = this.parte.porcentajeIvaCliente;
    
          }
         }
         this.trabajoModificado.precioCliente = preCli;
       
         if(preCli != 0) {
           preCli = Math.round(preCli * 100) / 100;
           precioCli = uni * preCli;
           precioCli = Math.round(precioCli * 100) / 100;
           this.trabajoModificado.importeCliente = precioCli;
         }
         if(ivaCliente !== 0 && preCli !== 0) {
           soloIvaCli = ((precioCli * ivaCliente)/100);
           if(uni != 0) {
            ivaCli = precioCli + ((precioCli * ivaCliente)/100);
           } else {
              ivaCli = 0;
           }
           //redondeamos a dos decimales
           soloIvaCli = Math.round(soloIvaCli * 100) / 100;
           ivaCli = Math.round(ivaCli * 100) / 100
     
           this.trabajoModificado.importeClienteIva = ivaCli;
           this.trabajoModificado.totalClienteIva = soloIvaCli;
         }
         /* this.formatPreciosCliente();
         this.formatUnidades(); */
    } catch(error) {
      this.uiService.controlDeError(error);
      return;
    }
    
  }


  formatEntradaSalida(event: any) {
    if(this.propagacion) return;
    //casdo que haya hora entrada poro no de salida
    if(this.trabajoModificado.horaEntrada && !this.trabajoModificado.horaSalida) {
      var fechaE = new Date(this.trabajoModificado.horaEntrada);
      this.horaE = moment(fechaE);
      this.horaEntradaFormat = moment(fechaE).format('HH:mm')
      this.tiempoTrabajo = null

    }
    
    //en caso de que haya hora entrada y salida
    else if(this.trabajoModificado.horaEntrada && this.trabajoModificado.horaSalida) {
     //formateo hora entrada
     var fechaE = new Date(this.trabajoModificado.horaEntrada);
     var horaEntrada = moment(fechaE);
     this.horaEntradaFormat =  moment(fechaE).format('HH:mm')
    
     //formateo hora salida
     var fechaS = new Date(this.trabajoModificado.horaSalida);
     var horaSalida = moment(fechaS);
     this.horaSalidaFormat = moment(fechaS).format('HH:mm')
    

     var df = horaSalida.diff(horaEntrada, 'hours', true);//diferencia con fraccion decimal
     var hours = horaSalida.diff(horaEntrada, 'hours');//diferencia solo las horas
     var minutes = 0;
     if(hours < 1) {
      hours = 1 //minimo una hora de trabajo
     } else {
      var minutes = df % 1; // minutos de trabajo
      


      //fraccciones de media hora
      if(minutes) {
       if(minutes < 0.5 && minutes > 0.01) minutes = 0.5;
       if (minutes > 0.5) minutes = 1
       if(minutes < 0.5 && minutes < 0.01) minutes = 0;

      }
   
     }

    
     
     //asigmanos el tiempo trabajado
     var unidades = hours + minutes//sumamos los minutos redondeados a fracción de media hora
     this.tiempoTrabajo = unidades


     //formateamos la fecha de entrada y salidsa para guardarla en la base de datos
     this.horaE = moment(fechaE).format('YYYY-MM-DD HH:mm:ss');
     this.horaS = moment(fechaS).format('YYYY-MM-DD HH:mm:ss');

     //actualizamos las unidades
       this.trabajoModificado.unidades = unidades;
       //this.unidadesFormat =  numeral(unidades).format('0,0.0');
       this.calculaImportes();
  } else if(!this.trabajoModificado.horaEntrada && !this.trabajoModificado.horaSalida) {
    this.horaE = null;
    this.horaS = null;
    this.tiempoTrabajo = null
 }
}

onHoraEntradaManual(event: any) {
  let inputValue = event.detail.value;

  // Si el input tiene al menos dos caracteres (dos dígitos de la hora), añadir los dos puntos.
  if (inputValue.length === 2 && !inputValue.includes(':')) {
    inputValue = inputValue + ':';  // Añadimos los dos puntos
    this.horaEntradaFormat= inputValue;
  }

  // Ahora validamos si el formato es válido (HH:mm)
  const regex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;

  if (regex.test(inputValue)) {
    const [horas, minutos] = inputValue.split(':').map(Number);

    const fechaActual = new Date();
    fechaActual.setHours(horas, minutos, 0, 0);

    // Usamos formato local sin zona horaria
    const fechaLocalString = moment(fechaActual).format('YYYY-MM-DDTHH:mm');

    // Asignamos el valor al modelo
    this.trabajoModificado.horaEntrada = fechaLocalString;
    this.horaEntradaFormat = inputValue;

    // Llamamos al método de formateo
    this.formatEntradaSalida({ detail: { value: fechaLocalString } });
  }
}



onHoraSalidaManual(event: any) {
  let inputValue = event.detail.value;

  // Si el input tiene al menos dos caracteres (dos dígitos de la hora), añadir los dos puntos.
  if (inputValue.length === 2 && !inputValue.includes(':')) {
    inputValue = inputValue + ':';  // Añadimos los dos puntos
    this.horaSalidaFormat= inputValue;
  }

  const regex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;

  if (regex.test(inputValue)) {
    const [horas, minutos] = inputValue.split(':').map(Number);

    const fechaActual = new Date();
    fechaActual.setHours(horas, minutos, 0, 0);

    const fechaLocalString = moment(fechaActual).format('YYYY-MM-DDTHH:mm');

    this.trabajoModificado.horaSalida = fechaLocalString;
    this.horaSalidaFormat = inputValue;

    this.formatEntradaSalida({ detail: { value: fechaLocalString } });
  }
}



  async guardarTrabajo(ftrabajo:NgForm) {
    //var fechaE, horaEntrada, fechaS, horaSalida, df;

    if (ftrabajo.invalid) {
      await this.uiService.alertaInformativa('Debe rellenar los campos correctamente');
      return;
    }
  
    if(this.trabajoModificado.precioCliente == 0 && this.trabajoModificado.precioProveedor != 0) {
      this.uiService.alertaInformativa("El precio del articulo para este cliente es 0, consulte con el administrador");
    }
    if(this.manoObra) {
      if(!this.trabajoModificado.horaEntrada || !this.trabajoModificado.horaSalida) {
        await this.uiService.alertaInformativa('Se tiene que introducir una hora de entrada y de salida');
        return;

      } else {
        //formateo hora entrada
        var fechaE = new Date(this.trabajoModificado.horaEntrada);
        var horaEntrada = moment(fechaE);
    
        //formateo hora salida
        var fechaS = new Date(this.trabajoModificado.horaSalida);
        var horaSalida = moment(fechaS);
        var df = horaSalida.diff(horaEntrada, 'hours', true);//diferencia con fraccion decimal

        if(df < 0) {
          await this.uiService.alertaInformativa('La hora de salida no puede ser inferior que la hora de entrada');
          return;
        }
      }
    
       
    }

     
    var data = {
      lineaparte: {
        parteLineaId: 0,
        parteId: this.trabajoModificado.parteId,
        codigoArticulo:  this.trabajoModificado.codigoArticulo,
        unidades:  this.trabajoModificado.unidades,


        tipoIvaProveedorId:  this.trabajoModificado.tipoIvaProveedorId,
        ivaProveedor:  this.trabajoModificado.procentajeIvaProveedor,
        precioProveedor:  this.trabajoModificado.precioProveedor,
        importeProveedor:  this.trabajoModificado.importeProveedor,
        importeProveedorIva:  this.trabajoModificado.importeProveedorIva,
        totalProveedorIva:  this.trabajoModificado.ivaProveedor,
        aCuentaProveedor: this.trabajoModificado.aCuentaProveedor,

        tipoIvaClienteId:  this.trabajoModificado.tipoIvaClienteId,
        ivaCliente:  this.trabajoModificado.porcentajeIvaCliente,
        precioCliente:  this.trabajoModificado.precioCliente,
        importeCliente:  this.trabajoModificado.importeCliente,
        importeClienteIva:  this.trabajoModificado.importeClienteIva,
        totalClienteIva:  this.trabajoModificado.totalClienteIva,


        descripcion:  this.trabajoModificado.descripcion,
        comentarios:  this.trabajoModificado.comentarios,

        horaEntrada: this.horaE,
        horaSalida: this.horaS,
        tiempoTrabajo: this.tiempoTrabajo
      }
    }
    if(this.trabajoModificado.parteLineaId) {
      var trabajoId = this.trabajoModificado.parteLineaId
      data.lineaparte.parteLineaId = this.trabajoModificado.parteLineaId
      
      try {
        var data2 = {
          parteLinea : {}
        }
        data2.parteLinea = data.lineaparte
        await this.comercializaService.putTrabajo(trabajoId, this.parte.servicioId, data2);
        this.uiService.presentToast('Trabajo modificado correctamente');
        await this.modalCtrl.dismiss('OK');
        //this.navCtrl.navigateRoot('tabs-parte/trabajos-tab');
        return;
      } catch (error: any) {
        if (error.status == 401) {
          this.uiService.alertaInformativa('Error al crear el trabajo');
          return;
        }
        this.uiService.controlDeError(error);
        return;
      }
    } 
    try {
      data.lineaparte.parteId = this.trabajoModificado.parteId
      await this.comercializaService.postTrabajo(this.trabajoModificado.parteId, this.parte.servicioId, data);
      this.uiService.presentToast('Trabajo creado correctamente');
      this.navCtrl.navigateForward('tabs-parte/trabajos-tab');
      await this.modalCtrl.dismiss('OK');
      //this.navCtrl.navigateRoot('/home');
    } catch (error:any) {
      if (error.status == 401) {
        this.uiService.alertaInformativa('Error al modificar el trabajo');
        return;
      }
      this.uiService.controlDeError(error);
    }
   
  }

  limpiarArticulo() {
    this.trabajoModificado.articulo = "";
    this.trabajoModificado.descripcion = "";
    this.showArticulos = false;
  }

 async dismiss() {
  await this.modalCtrl.dismiss();
  }

  submit() {
    this.guardarTrabajo(this.userFrm);
  }

  async buscarTrabajosParte() {
    var trabajos = [];
    try {
      trabajos = await this.comercializaService.getTrabajosParte(this.parte.parteId);
      if(trabajos) {
        if(trabajos.length > 0) {
          //buscamos trabajos con hora entrada y salida anteriores
          trabajos.forEach( (t: { horaEntrada: any; horaSalida: any; unidades: number; }) => {
            if(t.horaEntrada || t.horaSalida) {
              this.trabajoModificado.horaEntrada = t.horaEntrada;
              this.trabajoModificado.horaSalida = t.horaSalida;
              if(t.unidades) {
                if(t.unidades > 0) {
                  this.trabajoModificado.unidades = t.unidades;
                }
              
              }
            }
            
          });
          
        }
        //this.calculaImportes();
      }

   }catch(error) {
      this.uiService.controlDeError(error);
    }
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
