import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { EmpresaService } from './empresa.service';

@Injectable({
  providedIn: 'root'
})
export class ParametrosService {

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private empresaService: EmpresaService
  ) { }

    
  getParametros() {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.get(`${empresa.url}/api/parametros/`)
      .subscribe(async (resp:any) =>{
        var p = resp[0]
        var data = 
        {
          parametros: {
            tituloPush: p.tituloPush,
            appId: p.appId,
            gcm: p.gcm,
            restApi: p.restApi,
            bucket: p.bucket,
            bucket_region: p.bucket_region,
            bucket_folder: p.bucket_folder,
            identity_pool: p.identity_pool,
            raiz_url: p.raiz_url

          }
        }
        await this.guardarParametros(data.parametros);
        resolve(resp);
      },
      err => {
        reject(err);
      })
    })
  }

  async guardarParametros(params:any) {
    await this.storage.set('comercializa-params', params);
  }

  async recuperaParametros() {
    const params = await this.storage.get('comercializa-params');
    return params;
  }
}

  

