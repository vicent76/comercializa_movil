import { Component, OnInit, Input } from '@angular/core';
import { NavController, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
})
export class MenuItemComponent implements OnInit {

  @Input() titulo: string = '';
  @Input() contenido: string = '';
  @Input() pagina: string = '';
  @Input() imagen: string = '';

  constructor(
    private navCtrl: NavController,
    private menuCtrl: MenuController
  ) { }

  ngOnInit() {}

  goPagina(pagina: any) {
    this.navCtrl.navigateForward(pagina);
    this.menuCtrl.close();
  }
}
