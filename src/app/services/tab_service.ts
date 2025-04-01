import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { EmpresaService } from './empresa.service';
import { UsuarioService } from './usuario.service';


@Injectable({
    providedIn: 'root'
  })
  export class TabService {
    
    states: { [s: string]: any } = {};
    constructor(
      private http: HttpClient,
      private storage: Storage,
      private empresaService: EmpresaService,
      private usuarioService: UsuarioService,
      //private estados: any

    ) { }


    setState(tab: string, enabled: boolean) {
        this.states[tab] = enabled;
    }
}  