import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UiService } from 'src/app/services/ui.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ParametrosService } from 'src/app/services/parametros.service';
import { Platform, NavController } from '@ionic/angular';
import OneSignal from 'onesignal-cordova-plugin';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginUser = {
    usuario: '',
    password: ''
  };

  params: any;

  constructor(
    private uiService: UiService,
    private usuarioService: UsuarioService,
    private navCtrl: NavController,
    private parametrosService: ParametrosService,
    private plt: Platform,
  ) { }

  async ngOnInit() {
    try {
      this.params = await this.parametrosService.getParametros();
    } catch(error) {
      this.uiService.controlDeError(error);
    }
  }

  
  async login(fLogin:NgForm) {
    if(fLogin.invalid) {
      this.uiService.alertaInformativa('Debe rellenar los campos correctamente');
      return;
    }
    try {
      await this.usuarioService.login(this.loginUser.usuario, this.loginUser.password);
      this.navCtrl.navigateRoot('/home');
    } catch (error: any) {
      this.loginUser = {
        usuario: '',
        password: ''
      };
      if (error.status == 401) {
        this.uiService.alertaInformativa('Usuario y/o contraseña incorrectos');
        return;
      }
      this.uiService.controlDeError(error);
    }
  }
  async loginUsuPush(fLogin:NgForm) {
    if(fLogin.invalid) {
      this.uiService.alertaInformativa('Debe rellenar los campos correctamente');
      return;
    }
    try {
      await this.usuarioService.loginUsuPush(this.loginUser.usuario, this.loginUser.password);
      this.navCtrl.navigateRoot('/home');
    } catch (error: any) {
      this.loginUser = {
        usuario: '',
        password: ''
      };
      if (error.status == 500) {
        this.uiService.alertaInformativa('Usuario y/o contraseña incorrectos');
        return;
      }
      this.uiService.controlDeError(error);
    }
  }
}
