import { Component, OnInit, Input } from '@angular/core';
import { NavController, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input()
  titulo!: string;

  constructor(
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    
  ) { }

  ngOnInit() {}

  
  goInicio() {
    this.navCtrl.navigateRoot('/home');
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }

}
