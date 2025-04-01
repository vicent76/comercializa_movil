import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ComercializaService } from 'src/app/services/comercializa.service';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss'],
})
export class MenuListComponent implements OnInit {

  constructor(
    private navCtrl: NavController,
    private comercializaService: ComercializaService
  ) { }

  async ngOnInit() {
    await this.comercializaService.borrarEstadoCheck();
    await this.comercializaService.borrarFiltroParte();
    await this.comercializaService.borrarFiltroPresupuesto();
  }

  goNotificaciones() {
    this.navCtrl.navigateForward('/notificaciones');
  }

  goPartes() {
    this.navCtrl.navigateForward('/partes/0');
  }

  goPresupuestos() {
    this.navCtrl.navigateForward('/presupuestos');
  }


  goAjustes() {
    this.navCtrl.navigateForward('/login');
  }


}
