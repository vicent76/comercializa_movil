import { Component, OnInit } from '@angular/core';
import { ComercializaService } from 'src/app/services/comercializa.service';
import { UiService } from 'src/app/services/ui.service';
import { ModalController, AlertController } from '@ionic/angular';
import { ModalFotoPage } from '../../modals/modal-foto/modal-foto.page';
import { ParametrosService } from 'src/app/services/parametros.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { CameraPreview } from '@awesome-cordova-plugins/camera-preview/ngx';







@Component({
  selector: 'app-galeria',
  templateUrl: './galeria.page.html',
  styleUrls: ['./galeria.page.scss'],
})
export class GaleriaPage implements OnInit {

  image: any = null;
  storeImagen: any = null;
  parte: any = {};
  ModalFotoPage: any;
  fotos: any = [];
  fotoId: number = 0;
  param: any = {};
  empresa: any = {};
  cargando: any = false;
  antParte: any = {};
  cameraActive = false;
  
 

  constructor(
    private comercializaService: ComercializaService,
    private uiService: UiService,
    private parametrosService: ParametrosService,
    private camera: Camera,
    private modalCtrl: ModalController,
    private empresaService: EmpresaService,
    private alertController: AlertController,
    private file: File,
    private cameraPreview: CameraPreview
  ) { }

  ngOnInit() {
    this.init(true);
  }


  ionViewDidEnter() {
    this.init(false);
  }

  async init(enCarga: boolean) {
    let espera = null;
    try {
      var opcion = null;
      this.parte = this.comercializaService.getParteDetalleObj();
      this.storeImagen = await this.comercializaService.getImagenData();
      this.antParte = await this.comercializaService.getAntParte()
      if(this.parte) {
        espera = this.uiService.iniciarEspera();
        let data = await this.comercializaService.getParteFotos(this.parte.parteId);
        this.fotos = data;
        if(this.fotos) {
          let n = this.fotos.length;
          this.fotoId = n + 1;
        } else {
          this.fotoId = 1;
        }
        (await espera).dismiss(); 
        if(!enCarga) {
          if(this.storeImagen && this.antParte) {
            //this.intentarDescartar('La carga de la carga de una imagen del parte ' + this.antParte.numParte + ', ¿Desea volver a subirla?');
          }
        }
      }
      this.empresa = await this.empresaService.getEmpresa();
      this.param = await this.parametrosService.getParametros();
      this.param = this.param[0];
    }catch(error){
      if(espera) (await espera).dismiss(); 
      this.uiService.controlDeError(error);
    }

  }


  async intentarDescartar( message: string) {
    const alert = await this.alertController.create({
      header: 'ATENCIÓN',
      message,
      buttons: [
        {
          text: 'Descartar imagen',
          handler: () => {
            alert.dismiss();
            this.comercializaService.borrarImagenData();
            this.comercializaService.borrarAntParte();
          }
        },
        {
          text: 'Reintentar',
          handler: () => { 
            alert.dismiss();
            //this.saveAPI(null);
          }
        }
            
      ],
      animated: true
    });
    
    return await alert.present();
  }
  


  async openModalImagen(foto: any) {
      try {
        this.comercializaService.guardarImagenDetalle(foto);
        this.ModalFotoPage = await this.modalCtrl.create({
        component: ModalFotoPage
      });

      
      return await this.ModalFotoPage.present();

    } catch(error) {
      this.uiService.controlDeError(error);
    }
    
  }

  //funciones que implementan la toma de fotos

  ionViewWillLeave() {
    this.image = null;
  }

  takePictureFromGallery() {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.FILE_URI,
      mediaType: this.camera.MediaType.PICTURE,
      encodingType: this.camera.EncodingType.JPEG,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      targetWidth: 512,
      targetHeight: 512
    };
  
    this.camera.getPicture(options).then(async (imagePath) => {
      try {
        const fileEntry = await this.file.resolveLocalFilesystemUrl(imagePath) as any;
       
        fileEntry.file((file: Blob) => {
          const reader = new FileReader();
  
          reader.onloadend = () => {
            if (reader.result !== null) {
              const blob = new Blob([reader.result], { type: file.type });
              
              const generatedName = this.parte.numParte + "_" + this.empresa.codigo + "_ID_" + this.fotoId + "_imagen.jpeg";
              
              this.saveAPI(generatedName, blob);
            } else {
              this.uiService.controlDeError("Error al leer el archivo: result es null");
            }
          };
  
          reader.readAsArrayBuffer(file); // importante usar ArrayBuffer para Blob
        }, (err: any) => {
          this.uiService.controlDeError(err);
        });
  
      } catch (err) {
        this.uiService.controlDeError(err);
      }
    }, (error) => {
      this.uiService.controlDeError(error);
    });
  }
  
  catchPicture() {
    const options: any = {
      width: 512,
      height: 512,
      quality: 100
    };
    
    this.cameraPreview.takePicture(options).then(async (imageData) => {
      const base64 = 'data:image/jpeg;base64,' + imageData;
      const blob = this.base64ToBlob(base64);
      const nombre = `${this.parte.numParte}_${this.empresa.codigo}_ID_${this.fotoId}_imagen.jpeg`;
  
      this.saveAPI(nombre, blob);
      this.stopCamera(); // opcional si quieres cerrar preview tras captura
    }).catch(err => {
      this.uiService.controlDeError(err);
    });
  }
  
  base64ToBlob(base64: string): Blob {
    const byteString = atob(base64.split(',')[1]);
    const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
  
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
  
    return new Blob([ab], { type: mimeString });
  }
  
  async procesarImagen(imagePath: string) {
    try {
      const fileEntry = await this.file.resolveLocalFilesystemUrl(imagePath) as any;
  
      fileEntry.file((file: Blob) => {
        const reader = new FileReader();
  
        reader.onloadend = () => {
          if (reader.result !== null) {
            const blob = new Blob([reader.result], { type: file.type });
  
            const generatedName = `${this.parte.numParte}_${this.empresa.codigo}_ID_${this.fotoId}_imagen.jpeg`;
  
            this.saveAPI(generatedName, blob);
          } else {
            this.uiService.controlDeError("Error al leer el archivo: result es null");
          }
        };
  
        // Diferir lectura para evitar bloquear el hilo
        setTimeout(() => {
          reader.readAsArrayBuffer(file);
        }, 0);
  
      }, (err: any) => {
        this.uiService.controlDeError(err);
      });
  
    } catch (err) {
      this.uiService.controlDeError(err);
    }
  }
  async saveAPI(nombre: string, imagenBlob: Blob) {
    this.cargando = true;
  
    const formData = new FormData();
    formData.append('file', imagenBlob, nombre);
    formData.append('parteId', this.parte.parteId.toString());
    formData.append('numParte', this.parte.numParte.toString());
  
    try {
      await this.uiService.presentToast("Se está subiendo la imagen al servidor");
  
      // Este método debe aceptar FormData en tu servicio y hacer la petición al backend
      const datos: any = await this.comercializaService.decodeBlob(formData);
  
      const datos2 = {
        parteFotos: {
          parteFotoId: 0,
          parteId: this.parte.parteId,
          src: datos.Location
        }
      };
  
      this.creaParteFotos(datos2);
  
    } catch (err) {
      this.uiService.controlDeError(err);
    } finally {
      this.cargando = false;
    }
  }
  
  
async finalizaEspera(espera: any) {
  (await espera).dismiss();
}

async creaParteFotos(datos: object) {
  const espera = this.uiService.iniciarEspera();
  try {
    await this.comercializaService.borrarAntParte();
    await this.comercializaService.borrarImagenData();
    let f = await this.comercializaService.postParteFotos(datos);
    this.init(false)
    this.fotos = await this.comercializaService.getParteFotos(this.parte.parteId);
    //this.uiService.controlDeError(this.fotos.length);
   
    if(this.fotos) {
      this.fotos = [...this.fotos]; // Esto fuerza el renderizado del *ngFor
      //this.fotos.push(f);
      let n = this.fotos.length;
      this.fotoId = n + 1;
      (await espera).dismiss(); 
      this.uiService.aceptarCancelar('Foto subida correctamente')
    } else {
      this.fotoId = 1;
      (await espera).dismiss(); 
      this.uiService.aceptarCancelar('Foto subida correctamente')
    }
    this.cargando = false;
  }catch(error) {
    this.cargando = false;
    this.uiService.controlDeError(error);
    (await espera).dismiss();
  }
}

toggleCameraPreview() {
  if (this.cameraActive) {
    this.stopCamera();
  } else {
    this.startCamera();
  }
}

startCamera() {
  const options: any = {
    x: 0,
    y: 0,
    width: window.screen.width,
    height: 300,
    camera: 'rear',
    toBack: false,
    previewDrag: false,
    tapPhoto: false
  };

  this.cameraPreview.startCamera(options).then(() => {
    this.cameraActive = true;
  }).catch(err => {
    this.uiService.controlDeError(err);
  });
}

stopCamera() {
  this.cameraPreview.stopCamera().then(() => {
    this.cameraActive = false;
  }).catch(err => {
    this.uiService.controlDeError(err);
  });
}
}
