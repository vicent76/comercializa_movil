import { Injectable } from '@angular/core';
import { AlertController, ToastController, ModalController, NavController, LoadingController } from '@ionic/angular';
import { ErrorComponent } from '../components/error/error.component';
import { EmpresaService } from './empresa.service';
import { UsuarioService } from './usuario.service';

interface Empresa {
  codigo: string;
  deshabilitada: boolean;
  empresa: string; // Si esta propiedad existe
  logo?: string;   // Si `logo` es opcional, usa `?`
  // Otros campos que tenga Empresa
}
interface Usuario {
  nomusu: string
}
interface Datos {
  empresa: Empresa | null;
  usuario: Usuario | null;
}


@Injectable({
  providedIn: 'root'
})
export class UiService {

  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    private modalCtrl: ModalController,
    private empresaService: EmpresaService,
    private usuarioService: UsuarioService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController
  ) { 
    
  }

  async alertaInformativa( message: string) {
    const alert = await this.alertController.create({
      header: 'ATENCIÓN',
      message,
      buttons: ['Aceptar'],
      animated: true
    });

    await alert.present();
  }

  async aceptarCancelar( message: string) {
    const alert = await this.alertController.create({
      header: 'ATENCIÓN',
      message,
      buttons: [
        
        {
          text: 'Aceptar',
          handler: data => { 
            return true
          }
        }
            
      ],
      animated: true
    });

    await alert.present();
  }

  async intentarDescartar( message: string) {
    const alert = await this.alertController.create({
      header: 'ATENCIÓN',
      message,
      buttons: [
        {
          text: 'Descartar imagen',
          role: 'cancel',
          handler: data => {
            return false;
          }
        },
        {
          text: 'Reintentar',
          handler: data => { 
            return true
          }
        }
            
      ],
      animated: true
    });

    await alert.present();
  }

  async presentToast( message: string) {
    const toast = await this.toastController.create({
      position: 'top',
      message,
      duration: 1500
    });
    toast.present();
  }

  async controlDeError(err:any ) {
    const modal = await this.modalCtrl.create({
      component: ErrorComponent,
      componentProps: {
        Error: err
      }
    });
    return await modal.present();
  }

  async controlLogin(): Promise<Datos | void> {
    const datos: Datos = {
      empresa: null,
      usuario: null
    };
  
    try {
      const empresa = await this.empresaService.getEmpresa();
      // Si hay comunicación, los datos de empresa se actualizan
      datos.empresa = await this.empresaService.buscarEmpresa(empresa.codigo);
    } catch (error: any) {
      // Si se produce un error, los datos de empresa serán los locales
    }
  
    datos.usuario = await this.usuarioService.getUsuario();
  
    if (!datos.empresa) {
      this.navCtrl.navigateForward('/acceso');
      return;
    }
  
    if (!datos.usuario) {
      this.navCtrl.navigateForward('/login');
      return;
    }
  
    if (datos.empresa.deshabilitada) {
      const err = new Error('Lo sentimos. Esta aplicación está deshabilitada para esta empresa');
      this.controlDeError(err);
      this.navCtrl.navigateForward('/acceso');
      return;
    }
  
    return datos;
  }
  

  async iniciarEspera() {
    const espera = await this.loadingCtrl.create({
      message: 'Espere por favor...'
    });
    await espera.present();
    return espera;
  }

}
