import { Component, OnInit } from '@angular/core';
import { UrlTree } from '@angular/router';
import { NavController, MenuController } from '@ionic/angular';
import { ComercializaService } from 'src/app/services/comercializa.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  constructor(
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private comercializaService: ComercializaService
  ) { }

  ngOnInit() {}

  async ionViewWillEnter() {
   
  }


  async goPagina(pagina: string | any[] | UrlTree) {
    await this.comercializaService.borrarEstadoCheck();
    await this.comercializaService.borrarFiltroParte();
    await this.comercializaService.borrarFiltroPresupuesto();
    this.navCtrl.navigateForward(pagina);
    this.menuCtrl.close();
  }
}
