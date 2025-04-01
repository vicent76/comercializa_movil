import { Component, OnInit, ViewChild } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';;
import { ModalController } from '@ionic/angular';
import { ComercializaService } from 'src/app/services/comercializa.service';

@Component({
  selector: 'app-modal-foto',
  templateUrl: './modal-foto.page.html',
  styleUrls: ['./modal-foto.page.scss'],
})
export class ModalFotoPage implements OnInit {

  imagen: any = {};

  constructor(
    private uiService: UiService,
    private modalCtrl: ModalController,
    private comercializaService: ComercializaService
  ) { }

  async ngOnInit() {
    try{
      const datos = await this.comercializaService.getImagenDetalle();
      if(datos) {
        this.imagen = datos;
      }

    } catch(error) {
      this.uiService.controlDeError(error);
    }
  }

  async dismiss() {
    try {
      await this.modalCtrl.dismiss();
      this.comercializaService.borrarImagenDetalle();
    }catch(error) {
      this.uiService.controlDeError(error);
    }
  }

}
