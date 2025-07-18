import { Component, OnInit, Input, OnChanges, SimpleChanges, } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ComercializaService } from 'src/app/services/comercializa.service';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss'],
})
export class MenuListComponent implements OnInit {

      @Input() recargar: boolean = false;

      notificaciones: any[] = [];
      numNoLeidos = 0;

  constructor(
    private uiService: UiService,
    private navCtrl: NavController,
    private comercializaService: ComercializaService
  ) { }

  async ngOnInit() {
    this.numNoLeidos = 0;
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

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['recargar'] && changes['recargar'].currentValue === true) {
      await this.cargarNotificaciones();
    }
  }

   async cargarNotificaciones() {
    try {
       this.numNoLeidos = 0;
      const respuesta = await this.comercializaService.getNotificacionesUsuarioPush();
      this.notificaciones = respuesta;
     
      this.notificaciones.forEach(f => {
        if (f.estado !== 'LEIDO') {
          this.numNoLeidos++;
        }
      });
    } catch (error) {
      this.uiService.controlDeError(error);
    }
  }


}
