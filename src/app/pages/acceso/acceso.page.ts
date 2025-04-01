import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EmpresaService } from 'src/app/services/empresa.service';
import { UiService } from 'src/app/services/ui.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-acceso',
  templateUrl: './acceso.page.html',
  styleUrls: ['./acceso.page.scss'],
})
export class AccesoPage implements OnInit {

  codigo: string = '';

  constructor(
    private empresaService: EmpresaService,
    private uiService: UiService,
    private navCtrl: NavController
  ) { }

  async ngOnInit() {
    try {
      const empresa = await this.empresaService.getEmpresa();
    } catch (error: any) {
      console.log("Error", error)
    }
  }

  async buscarEmpresa(fEmpresa: NgForm) {
    if (fEmpresa.invalid) {
      this.uiService.alertaInformativa('Debe rellenat correctamente todos los campos');
      return;
    }
    try {
      await this.empresaService.buscarEmpresa(this.codigo);
      this.navCtrl.navigateForward('/login');
    } catch (error: any) {
      if (error.status && error.status == 404) {
        this.uiService.alertaInformativa('No se ha encontrado empresa con ese código');
      } else {
        // Control de error general
        this.uiService.controlDeError(error);
      }
    }
  }


}
