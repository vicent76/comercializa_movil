import { Component, OnInit } from '@angular/core';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {

  version = "0.0.0";

  constructor(
    private appVersion: AppVersion
  ) { }

  async ngOnInit() {
    try {
      this.version = await this.appVersion.getVersionNumber();
    } catch (error: any) {
      // Disparará error mientras estemos en desarrollo
      console.log("No se ha podido obtener la versión");
    }
  }

}
