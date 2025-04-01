import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { EmpresaService } from './empresa.service';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private empresaService: EmpresaService,
  ) { }

  login(login: string, password: string) {
    const data = {
      login,
      password
    };
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.post(`${empresa.url}/api/proveedores/login/password/registro`, data)
      .subscribe(async (resp:any) =>{
        await this.borrarusuario();
        let a = await this.guardarUsuarioLocal(resp.profesional);
        console.log(a);
        resolve(resp);
      },
      err => {
        reject(err);
      })
    })
  }

  loginUsuPush(login: string, password: string) {
    const data = {
      login,
      password
    };
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.post(`${empresa.url}/api/proveedores/login/usuPush/password/registro`, data)
      .subscribe(async (resp:any) =>{
        await this.borrarusuario();
        let a = await this.guardarUsuarioLocal(resp.profesional);
        console.log(a);
        resolve(resp);
      },
      err => {
        reject(err);
      })
    })
  }

  putUsuario(id: number, data: object): any {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.put(`${empresa.url}/api/proveedores/playerId/${id}`, data)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }

  putUsuarioPush(id: number, data: object): any {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.put(`${empresa.url}/api/proveedores/playerId/usuPush/${id}`, data)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }




  guardarUsuarioLocal(usuario: object): any {
    return new Promise(async (resolve, reject) => {
      this.storage.set('comercializa-usuario', usuario)
        .then(async (resp: any) => {
          resolve(resp);
        })
          .catch(err => {
            reject(err);
          })
    })
  }


  async getUsuario() {
    const usuario = await this.storage.get('comercializa-usuario');
    return usuario;
  }

  async borrarusuario() {
    await this.storage.remove('comercializa-usuario');
  }

}
