import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ComercializaService } from 'src/app/services/comercializa.service';
import { ParametrosService } from 'src/app/services/parametros.service';
import { UiService } from 'src/app/services/ui.service';;
import { NgForm } from '@angular/forms';
import { NavController, ModalController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import SignaturePad from 'signature_pad';
import * as moment from 'moment';






@Component({
  selector: 'app-firma-parte',
  templateUrl: './firma-parte.page.html',
  styleUrls: ['./firma-parte.page.scss'],
})
export class FirmaPartePage implements OnInit, AfterViewInit {

  signaturePad: any;
  canvasWidth!: number;
  canvasHeight!: number;
  param: any = {};
  parte: any = {};
  usuario: any = {};
  imagenes: any = {};
  trabajos: any = [];
  empresa: any = {};

  @ViewChild('canvas', { static: true })
  signaturePadElement!: { nativeElement: HTMLCanvasElement; };
  @ViewChild('fFirma', { static: true })
  userFrm!: NgForm;



  parteModificado: any = {
    /*   parteId: 0,
      numParte: '',
      fecha_reparacion: '',
      descripcion_averia: '',
      trabajosPendientes : '',
      servicioId: 0,
      numServicio: 0,
      estadoParteProfesionalId: 0, 
      estadoParteId: 2,
      proveedorId: 0,
      empresaParteId: 0,
      operadorId: 0,
      trabajos_realizados: null,
      confirmado: 0,
      observacionesDelProfesional: '',
      email: '',
      clienteId: 0,
      porcentajeIvaCliente: 0,
      tipoIvaClienteId: 0,
      direccionTrabajo: '',
      tipoGarantiaId: 0,
      
   */
    nombreFirmante: null,
    apellidosFirmante: null,
    dniFirmante: null,
    cargoFirmante: null,
    firma: null,
    noFirma: 0
  };


  constructor(
    private comercializaService: ComercializaService,
    private parametrosService: ParametrosService,
    private navCtrl: NavController,
    private uiService: UiService,
    private modalCtrl: ModalController,
    private usuarioService: UsuarioService,
    private empresaService: EmpresaService,
    private elementRef: ElementRef
  ) { }

  ngOnInit() {
    this.init(false);

  }

  ionViewDidEnter() {
    this.init(true);
  }

  async init(enter: boolean) {
    try {
      this.usuario = await this.usuarioService.getUsuario();
      this.empresa = await this.empresaService.getEmpresa();
      var datos = this.comercializaService.getParteDetalleObj();
      this.param = await this.parametrosService.getParametros();
      this.param = this.param[0];

      //cargamos la info del parte
      if (datos) {
        this.parte = datos;
        this.imagenes = await this.comercializaService.getParteFotos(this.parte.parteId);
        this.trabajos = await this.comercializaService.getTrabajosParte(this.parte.parteId);
        this.parteModificado.parteId = this.parte.parteId;
        this.parteModificado.trabajosPendientes = this.parte.trabajosPendientes;
        this.parteModificado.trabajos_realizados = this.parte.trabajos_realizados;
        this.parteModificado.observacionesDelProfesional = this.parte.observacionesDelProfesional;
        //
        this.parteModificado.nombreFirmante = this.parte.nombreFirmante;
        this.parteModificado.apellidosFirmante = this.parte.apellidosFirmante;
        this.parteModificado.dniFirmante = this.parte.dniFirmante;
        this.parteModificado.cargoFirmante = this.parte.cargoFirmante;
        this.parteModificado.firma = this.parte.firma;
        this.parteModificado.noFirma = this.parte.noFirma;
      }

      const canvas: any = this.elementRef.nativeElement.querySelector('canvas');
      if (this.signaturePad && !enter) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - 1000;
        this.signaturePad.clear(); // Clear the pad
      }

    } catch (error) {
      this.uiService.controlDeError(error);
    }

    //CARGAMOS LOS DATOS Y LA FIRMA SI EXISTEN
    if (!this.parteModificado.dniFirmante && !enter) {
      this.signaturePad = new SignaturePad(this.signaturePadElement.nativeElement, {
        // It's Necessary to use an opaque color when saving image as JPEG;
        // this option can be omitted if only saving as PNG or SVG
        backgroundColor: 'rgb(255, 255, 255)',
        penColor: 'rgb(56,128,255)'
      });
      //this.signaturePad = new SignaturePad();
      this.signaturePad.clear();
      //this.signaturePad.penColor = 'rgb(56,128,255)';
      //this.signaturePad.backgroundColor = 'rgb (255, 255, 255)'
    }
    if (this.parteModificado.dniFirmante && this.parteModificado.nombreFirmante && this.parteModificado.apellidosFirmante && this.parteModificado.cargoFirmante) {
      this.parteModificado.nombreFirmante = this.parte.nombreFirmante;
      this.parteModificado.apellidosFirmante = this.parte.apellidosFirmante;
      this.parteModificado.dniFirmante = this.parte.dniFirmante
      this.parteModificado.firma = this.parte.firma;
      this.parteModificado.noFirma = this.parte.noFirma;
      this.parteModificado.cargoFirmante = this.parte.cargoFirmante
    } else {
      this.parteModificado.noFirma = this.parte.noFirma;
    }
  }


  ngAfterViewInit(): void {

  }

  ionViewWillLeave() {
    this.parte.nombreFirmante = this.parteModificado.nombreFirmante;
    this.parte.apellidosFirmante = this.parteModificado.apellidosFirmante;
    this.parte.dniFirmante = this.parteModificado.dniFirmante;
    this.parte.cargoFirmante = this.parteModificado.cargoFirmante;
    this.parte.firma = this.parteModificado.firma;
    this.parte.noFirma = this.parteModificado.noFirma;
    this.comercializaService.guardarParteDetalleObj(this.parte);

  }


  async save() {
    var fecha_reparacion;
    var fecha_firma;
    var datos = {};
    this.parte.nombreFirmante = this.parteModificado.nombreFirmante
    this.parte.apellidosFirmante = this.parteModificado.apellidosFirmante
    this.parte.dniFirmante = this.parteModificado.dniFirmante
    this.parte.cargoFirmante = this.parteModificado.cargoFirmante
    this.parte.firma = this.parteModificado.firma
    this.parte.noFirma = this.parteModificado.noFirma
    this.comercializaService.guardarParteDetalleObj(this.parte);
    if (!this.parteModificado.noFirma) {
      if (this.userFrm.invalid) {
        await this.uiService.alertaInformativa('Debe rellenar los campos correctamente.');
        return;
      } else if (this.signaturePad.isEmpty()) {
        await this.uiService.alertaInformativa('No se ha firmado el parte.');
        return;
      }
    }
    if (this.isEmptyString(this.parte.trabajos_realizados)) {
      await this.uiService.alertaInformativa('No está escrita la reparación que se ha realizado en el formulario de la pestaña PARTE.');
      this.parte.noFirma = false;
      this.parteModificado.noFirma = false;
      //this.comercializaService.guardarParteDetalleObj(this.parte);
      //delete this.parteModificado.dniFirmante
      return;
    }


    if (this.trabajos.length == 0) {
      await this.uiService.alertaInformativa('No se puede cerrar, no hay trabajos creados.');
      this.parte.noFirma = false;
      this.parteModificado.noFirma = false;
      //this.comercializaService.guardarParteDetalleObj(this.parte);
      //delete this.parteModificado.dniFirmante

      return;
    }



    const file = this.signaturePad.toDataURL("image/jpeg");

    var block = file.split(";");
    var realData = block[1].split(",")[1];

    if (this.parteModificado.noFirma) {
      fecha_reparacion = moment(new Date()).format('YYYY-MM-DD');

      fecha_firma = moment(new Date()).format('YYYY-MM-DD');
      datos = {
        parte: {
          parteId: this.parte.parteId,
          firma: null,
          nombreFirmante: null,
          apellidosFirmante: null,
          dniFirmante: null,
          cargoFirmante: null,
          noFirma: this.parteModificado.noFirma,
          fecha_cierre_cliente: fecha_reparacion,
          fecha_reparacion: fecha_reparacion,
          estadoParteProfesionalId: 8,
          estadoParteId: 5,
          fecha_firma: fecha_firma,
          observacionesDelProfesional: this.parte.observacionesDelProfesional,
          trabajos_realizados: this.parte.trabajos_realizados,
          trabajosPendientes: this.parte.trabajosPendientes,
        }
      }
      this.actulizaParte(datos, false);

    } else {
      const espera = this.uiService.iniciarEspera();
      try {
        let data = {
          b64: {
            datos: realData,
            nombre: this.parte.numParte + "_" + this.empresa.codigo + "_firma.jpeg",
            parteId: this.parte.parteId
          }
        }
        var data2 = await this.comercializaService.decodeData(data);

        if (data2) {
          fecha_reparacion = moment(new Date()).format('YYYY-MM-DD');
          fecha_firma = moment(new Date()).format('YYYY-MM-DD');
          datos = {
            parte: {
              parteId: this.parte.parteId,
              firma: data2.Location,
              nombreFirmante: this.parteModificado.nombreFirmante,
              apellidosFirmante: this.parteModificado.apellidosFirmante,
              dniFirmante: this.parteModificado.dniFirmante,
              noFirma: this.parteModificado.noFirma,
              cargoFirmante: this.parteModificado.cargoFirmante,
              fecha_cierre_profesional: fecha_reparacion,
              fecha_cierre_cliente: fecha_reparacion,
              fecha_reparacion: fecha_reparacion,
              estadoParteProfesionalId: 2,
              estadoParteId: 5,
              fecha_firma: fecha_firma,
              observacionesDelProfesional: this.parte.observacionesDelProfesional,
              trabajos_realizados: this.parte.trabajos_realizados,
              trabajosPendientes: this.parte.trabajosPendientes,
            }
          }

          //modificamos el objeto parteModificado
          this.finalizaEspera(espera);
          this.actulizaParte(datos, false);

        }
      } catch (err) {
        this.uiService.controlDeError(err);

      }
    }
  }

  async finalizaEspera(espera: any) {
    (await espera).dismiss();
  }



  clear() {
    this.signaturePad.clear();
  }

  undo() {
    const data = this.signaturePad.toData();
    if (data) {
      data.pop(); // remove the last dot or line
      this.signaturePad.fromData(data);
    }
  }


  async actulizaParte(parte: any, borradoFirma: any) {
    const espera = this.uiService.iniciarEspera();
    try {
      if (borradoFirma) {
        await this.comercializaService.putParte(this.parte.parteId, parte);
        this.uiService.presentToast('Firma borrada correctamente');
        (await espera).dismiss();
        this.comercializaService.guardarParteDetalleObj(this.parteModificado);
        this.navCtrl.navigateForward("tabs-parte/parte-tab/" + parte.parteId);
      } else {
        var parteId = this.parte.parteId;
        var servicioId = this.parte.servicioId;
        var data2 = {
          datos: {
            parteId: parteId,
            servicioId: servicioId,
            proveedorId: this.usuario.usuarioId,
            proveedorNombre: this.usuario.nomusu,
            numParte: this.parte.numParte,
            opcion: 'CERRADO',
            empresa: this.parte.usuario,
            direccionTrabajo: this.parteModificado.direccionTrabajo,
            email: this.parte.email
          }
        }
        //await this.comercializaService.putParte(this.parte.parteId, parte);
        var resp = await this.comercializaService.putParteCreaPdf(servicioId, parteId, parte, this.empresa.codigo);
        if (resp) {
          try {
            await this.comercializaService.enviarCorreoCerrado(data2);
            await this.comercializaService.sendNotificacionWeb(data2);
            (await espera).dismiss();
            this.comercializaService.borrarParteDetalleObj();

            this.uiService.presentToast('Se ha cerrado y generado un PDF del parte.');

            this.navCtrl.navigateForward("partes/" + this.parte.parteId);

          } catch (error: any) {

            (await espera).dismiss();
            if (error.status == 500) {
              this.uiService.alertaInformativa("Fallo al notificar a administración.");
              this.comercializaService.borrarParteDetalleObj();

              this.uiService.presentToast('Se ha cerrado y generado un PDF del parte.');

              this.navCtrl.navigateForward("partes/" + this.parte.parteId);

              return;
            }
            this.uiService.controlDeError(error);
          }

        } else {
          (await espera).dismiss();
          this.uiService.alertaInformativa("Fallo de respuesta del servidor, no se ha podido guardar.");
        }

      }
    } catch (error: any) {
      (await espera).dismiss();
      if (error.status == 500) {
        this.uiService.alertaInformativa("Fallo de respuesta del servidor, no se ha podido guardar.");
        return;
      }
      this.uiService.controlDeError(error);
    }
  }

  deleteFirma() {
    this.parteModificado.noFirma = 0;
    var datos = {
      parte: {
        parteId: this.parteModificado.parteId,
        noFirma: this.parteModificado.noFirma,
        fecha_cierre_profesional: null,
        fecha_reparacion: null,
        estadoParteProfesionalId: 8,
        fecha_firma: null
      }
    }
    this.actulizaParte(datos, true);
  }


  async dismiss() {
    await this.modalCtrl.dismiss();
  }

  compruebaDni(event: any) {
    var nif = this.parteModificado.dniFirmante;
    if (!nif || nif == "") return;

    nif = nif.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    this.parteModificado.dniFirmante = nif;

    var patron = new RegExp(/^\d{8}[a-zA-Z]{1}$/);//VALIDA NIF
    var esNif = patron.test(nif);

    var patron2 = new RegExp(/^[a-zA-Z]{1}\d{7}[a-zA-Z0-9]{1}$/);
    var esCif = patron2.test(nif);
    if (esNif || esCif) {

    } else {
      this.uiService.alertaInformativa('El nif introducido no tiene un formato valido');
      //this.parteModificado.dniFirmante = null;
    }


  }

  isEmptyString(value: string | null | undefined): boolean {
    return !value || value.length === 0;
  }


}
