import { Component, OnInit, ViewChild } from '@angular/core';
import { ComercializaService } from 'src/app/services/comercializa.service';
import { UiService } from 'src/app/services/ui.service';;
import { NgForm } from '@angular/forms';
import { NavController, ModalController, NavParams } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';


import * as moment from 'moment';
import * as numeral from 'numeral';

@Component({
  selector: 'app-presupuesto-trabajo-detalle',
  templateUrl: './presupuesto-trabajo-detalle.page.html',
  styleUrls: ['./presupuesto-trabajo-detalle.page.scss'],
})
export class PresupuestoTrabajoDetallePage implements OnInit {
  @ViewChild('ftrabajo', { static: true })
  userFrm!: NgForm;
  
  trabajo: any = {};
  articulo: any = {};
  trabajoModificado: any = {
    ofertaLineaId: 0,
    ofertaId: 0,
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
    //importeClienteIva: 0,
    ivaCliente: 0,
    //totalclienteIva: 0,


    descripcion: '',
    articulo: '',
    articuloId: 0,
    tipoProfesionalId: 0,
    capituloLinea: '',
    linea: 0
  };
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
 
  propagacion = true;
  oferta: any = {};

  //formateos
  precioClienteFormat: any = '';
  importeClienteFormat: any = '';
  //importeClienteIvaFormat: any = '';
  ivaClienteFormat: any = ''
  //totalClienteIvaFormat: any = '';

  precioProveedorFormat: any = '';
  importeProveedorFormat: any = '';

  unidadesFormat: any = '1';
  ofertaId = 0;


  constructor(
    private comercializaService: ComercializaService,
    private navCtrl: NavController,
    private uiService: UiService,
    private modalCtrl: ModalController,
    private usuarioService: UsuarioService,
    private navParams: NavParams
    ) { }
  

    async ngOnInit() {
      let p = null;
      var datos =  this.comercializaService.getPresupuestoTrabajoDetalleObj();
      this.parte = this.comercializaService.getParteDetalleObj();
      this.oferta = this.navParams.get('data');
      this.ofertaId = this.oferta.ofertaId;
      this.tiposIva = await this.comercializaService.getTiposIva();
      this.usuario = await this.usuarioService.getUsuario();
      
      //SI NO HAY PARTE LO BUSCAMOS
      if(!this.parte) {
        p = await this.comercializaService.getParteOfertaProveedor(this.oferta);
        if(p) this.parte = p[0];
      }
      this.login(datos);
      if(datos) {
       
        this.trabajo = datos;
        this.trabajoModificado.ofertaLineaId = this.trabajo.ofertaLineaId,
        this.trabajoModificado.ofertaId = this.trabajo.ofertaId,
        this.trabajoModificado.codigoArticulo = this.trabajo.codigoArticulo,
        this.trabajoModificado.unidades = parseFloat(this.trabajo.unidades),
        this.unidadesFormat = numeral(this.trabajo.unidades).format('0,0.0');
  
        this.trabajoModificado.tipoIvaProveedorId = this.trabajo.tipoIvaProveedorId,
        this.trabajoModificado.precioProveedor = this.trabajo.precioProveedor,
        this.trabajoModificado.importeProveedor = this.trabajo.importeProveedor,
        this.trabajoModificado.importeProveedorIva = this.trabajo.importeProveedorIva,
        this.trabajoModificado.ivaProveedor = this.trabajo.ivaProveedor,
  
        this.trabajoModificado.tipoIvaClienteId = this.trabajo.tipoIvaClienteId,
        this.trabajoModificado.precioCliente = this.trabajo.precioCliente,
        this.trabajoModificado.importeCliente = this.trabajo.importeCliente,
        //this.trabajoModificado.importeClienteIva = this.trabajo.importeClienteIva,
        this.trabajoModificado.ivaCliente = this.trabajo.ivaCliente,
        //this.trabajoModificado.totalClienteIva = this.trabajo.totalClienteIva;
  
        this.trabajoModificado.descripcion = this.trabajo.descripcion,
        this.trabajoModificado.articulo = this.trabajo.nombreArticulo,
        this.trabajoModificado.articuloId = this.trabajo.articuloId,
        
        
        this.trabajoModificado.tipoProfesionalId = this.parte.tipoProfesionalId;
        this.trabajoModificado.aCuentaProveedor = this.trabajo.aCuentaProveedor;

        this.trabajoModificado.capituloLinea = this.trabajo.capituloLinea;
        this.trabajoModificado.linea = this.trabajo.linea;
  
  
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
  
          /* this.formatPreciosCliente();
          this.formatPreciosProveedor(); */
          //this.formatUnidades();
        
  
      } else {
        this.propagacion = false;
        this.trabajoModificado.tipoProfesionalId = this.parte.tipoProfesionalId;
        this.trabajoModificado.ofertaId =  this.ofertaId;
        this.trabajoModificado.tipoIvaClienteId = this.parte.tipoIvaClienteId;
        this.trabajoModificado.porcentajeIvaCliente = this.parte.porcentajeIvaCliente;
        this.asignaCapitulo();
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
      } catch (error: any) {
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
               else if(this.articulos.length > 1 && parArt == this.articulos[0].nombre && this.trabajoModificado.ofertaLineaId != 0) {
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
              this.trabajoModificado.articuloId =  this.articulo.articuloId;
              this.trabajoModificado.descripcion =  this.articulo.nombre;
              if( this.articulo.codigoReparacion == 900)  this.trabajoModificado.descripcion = "";
              this.trabajoModificado.codigoArticulo =  this.articulo.codigoReparacion
              this.buscarPrecioUnitarioCliente();
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
     this.trabajoModificado.articuloId = articulo.articuloId;
      this.trabajoModificado.articulo = articulo.nombre;
      this.trabajoModificado.descripcion = articulo.nombre;
      if(articulo.codigoReparacion == 900)  this.trabajoModificado.descripcion = "";
      this.trabajoModificado.codigoArticulo = articulo.codigoReparacion
      this.showArticulos = false;
      this.buscarPrecioUnitarioCliente();
      
      if(this.trabajoModificado.codigoArticulo == 900) {
        this.isDisabled = false;
      } else {
        this.isDisabled = true;
      }
    }
  
    calculaImportes() {
      var precioPro = 0;
      if(this.propagacion) return;
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
        //var soloIvaPro = ((precioPro * ivaProveedor)/100);
        var ivaPro = precioPro + ((precioPro * ivaProveedor)/100);
        //redondeamos a dos decimales
        //soloIvaPro = Math.round(soloIvaPro * 100) / 100;
        ivaPro = Math.round(ivaPro * 100) / 100
  
        this.trabajoModificado.importeProveedorIva = ivaPro;
        //this.trabajoModificado.ivaProveedor = soloIvaPro;
      }
     /*  this.formatPreciosProveedor(); */
      this.calculaImportesCliente();
    }
  
  
    async calculaImportesCliente() {
      if(this.propagacion) return;
  
      var articulo = null
      var ivaCli = 0;
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
             var precioCli = uni * preCli;
             precioCli = Math.round(precioCli * 100) / 100;
             this.trabajoModificado.importeCliente = precioCli;
           }
          /*  if(ivaCliente !== 0 && preCli !== 0) {
             var soloIvaCli = ((precioCli * ivaCliente)/100);
             if(uni != 0) {
              ivaCli = precioCli + ((precioCli * ivaCliente)/100);
             } else {
                ivaCli = 0;
             }
             //redondeamos a dos decimales
             soloIvaCli = Math.round(soloIvaCli * 100) / 100;
             ivaCli = Math.round(ivaCli * 100) / 100
       
             this.trabajoModificado.importeClienteIva = ivaCli;
             //this.trabajoModificado.totalClienteIva = soloIvaCli;
           } */
           /* this.formatPreciosCliente();
           this.formatUnidades(); */
      } catch(error) {
        this.uiService.controlDeError(error);
        return;
      }
      
    }
  
    async asignaCapitulo() {
      //buscamos el resto de trabajos
      let proId = this.usuario.usuarioId
      let proIds = [];
      let trabajos = await this.comercializaService.getTrabajos(this.ofertaId, 0);
      let obj = {
        proveedorId: 0,
        capitulo: '',
        linea: 0 
      }
      let cont = 0;
      let procesado = false;
      let p = new Set<number>();
      let n = 0
      if(trabajos.length > 0) {
        //CAPIULO
          //extraemos las ids de los proveedores de las lineas
          for(let t of trabajos) {
            obj = {
              proveedorId: t.proveedorId,
              capitulo: t.capituloLinea,
              linea: t.linea 
            }
            proIds.push(obj);
            p.add(t.proveedorId);  //miramos el numero de proveedores diferentes que hay en los tabajos
          };
         
          //miramos si hay algún trabajo del proveedor
          for(let i = 0; i < proIds.length; i++) {
            if(proId == proIds[i].proveedorId) {
              this.trabajoModificado.capituloLinea = proIds[i].capitulo;
              procesado = true;
              break;
            }   
          } 
          if(!procesado) { //creamos un nuevo capitulo y una nueva linea
            n =  p.size + 1;
            this.trabajoModificado.capituloLinea = "Capitulo " + n;
            this.trabajoModificado.linea = n + 0.1;
          }
          //LINEA
          //contamos los trabajos del proveedor
           let numero = 0
          for (let p of proIds) {
            if(proId == p.proveedorId) {
              cont++;
              let capi = p.capitulo
              numero = parseInt(capi.match(/\d+/)?.[0] || '0');

            }
          }
          if(cont > 0) {
            cont = (cont + 1) / 10;
            this.trabajoModificado.linea = numero + cont;

          }

      } else {
        this.trabajoModificado.capituloLinea = "Capitulo 1";
        this.trabajoModificado.linea = 1.1
      }
    }
    
  
    async guardarTrabajo(ftrabajo:NgForm) {
  
      if (ftrabajo.invalid) {
        await this.uiService.alertaInformativa('Debe rellenar los campos correctamente');
        return;
      }
    
      if(this.trabajoModificado.precioCliente == 0 && this.trabajoModificado.precioProveedor != 0) {
        this.uiService.alertaInformativa("El precio del articulo para este cliente es 0, consulte con el administrador");
      }

       
      var data = {
        lineaOferta: {
          ofertaLineaId: 0,
          ofertaId: this.trabajoModificado.ofertaId,
          //codigoArticulo:  this.trabajoModificado.codigoArticulo,
          articuloId: this.trabajoModificado.articuloId,
          cantidad:  this.trabajoModificado.unidades,
          capituloLinea:  this.trabajoModificado.capituloLinea,
          linea: this.trabajoModificado.linea,
          unidadId:  9,
  
          proveedorId: this.usuario.usuarioId,
          tipoIvaProveedorId:  this.trabajoModificado.tipoIvaProveedorId,
          porcentajeProveedor:  this.trabajoModificado.procentajeIvaProveedor,
          importeProveedor:  this.trabajoModificado.precioProveedor,
          totalLineaProveedor:  this.trabajoModificado.importeProveedor,
          costeLineaProveedor: this.trabajoModificado.importeProveedor,
          precioProveedor: this.trabajoModificado.importeProveedor,
          perdtoProveedor: 0,
          dtoProveedor: 0,
          totalLineaProveedorIva:  this.trabajoModificado.importeProveedorIva,
          //porcentajeProveedor:  this.trabajoModificado.ivaProveedor,
        
          tipoIvaId:  this.trabajoModificado.tipoIvaClienteId,
          porcentaje:  this.trabajoModificado.porcentajeIvaCliente,
          importe:  this.trabajoModificado.precioCliente,
          totalLinea:  this.trabajoModificado.importeCliente,
          coste: this.trabajoModificado.importeCliente,
          precio: this.trabajoModificado.importeCliente,
          perdto: 0,
          dto: 0,

          //calculadora
          porcentajeBeneficio: 0,
          importeBeneficioLinea: 0,
          porcentajeAgente: 0,
          importeAgenteLinea: 0,
          ventaNetaLinea: 0,
      
          descripcion:  this.trabajoModificado.descripcion
        }
      }
      if(this.trabajoModificado.ofertaLineaId) {
        //var trabajoId = this.trabajoModificado.ofertaLineaId
        data.lineaOferta.ofertaLineaId = this.trabajoModificado.ofertaLineaId
        
        try {
          if(!data.lineaOferta.ofertaId) data.lineaOferta.ofertaId =   this.trabajoModificado.ofertaId;
          await this.comercializaService.putOfertaTrabajo(this.trabajoModificado.ofertaLineaId, data);
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
        await this.comercializaService.postOfertaTrabajo(data);
        this.uiService.presentToast('Trabajo creado correctamente');
        //this.navCtrl.navigateRoot('tabs-parte/trabajos-tab');
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
  
  
}
