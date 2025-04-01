import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage';

const URL_EMPRESA = 'https://5ney0a7oyj.execute-api.eu-west-3.amazonaws.com/dev'

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) { }

  buscarEmpresa(codigo: string): any {
      return new Promise((resolve, reject) => {
        this.http.get(`${URL_EMPRESA}/empresas/${codigo}`)
        .subscribe(async resp => {
          await this.guardarEmpresa(resp);
          resolve(resp)
        },
        err => {
          reject(err);
        })
      });
  }

  async guardarEmpresa(empresa: any) {
    try {
      await this.storage.set('comercializa-empresa', empresa);
    } catch(e) {
      console.log(e);
    }
   
  }

  async getEmpresa() {
    const empresa = await this.storage.get('comercializa-empresa');
    return empresa;
  }

}
