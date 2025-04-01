import { Component, OnInit } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';
import { EmpresaService } from 'src/app/services/empresa.service';

@Component({
  selector: 'app-cabecera',
  templateUrl: './cabecera.component.html',
  styleUrls: ['./cabecera.component.scss'],
})
export class CabeceraComponent implements OnInit {

  cabecera: any = {
    empresa: "Empresa desconocida",
    usuario: "Usuario desconocido",
    codigoEmpresa: 0
  };

  hayLogo: boolean = false;

  constructor(
    private uiService: UiService
  ) { }

  async ngOnInit() {
    const datos = await this.uiService.controlLogin();
  
    if (datos) {
      if (datos.usuario && datos.empresa) {
        this.cabecera.usuario = datos.usuario.nomusu;
        this.cabecera.empresa = datos.empresa.empresa;
        this.cabecera.codigoEmpresa = datos.empresa.codigo;
  
        if (datos.empresa.logo) {
          this.hayLogo = true;
        }
      }
    }
  }
  

}
