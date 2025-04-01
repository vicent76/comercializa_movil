import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent implements OnInit {

  @Input() Error: any;
  errText: string = '';
  sinConexion: boolean = false;

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.errText = JSON.stringify(this.Error);
    if (this.Error.status == 0) {
      this.sinConexion = true;
    }
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }
}
