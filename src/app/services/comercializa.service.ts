import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { EmpresaService } from './empresa.service';
import { UsuarioService } from './usuario.service';
//import { GaleriaPage } from '../pages/galeria/galeria.page';

@Injectable({
  providedIn: 'root'
})
export class ComercializaService {

  parte:any = {};
  trabajo: any = {};
  presupuestoTrabajo: any = {};
  firma: any = {};
  mensaje: any = {};
  //
  presupuesto: any = {};

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private empresaService: EmpresaService,
    private usuarioService: UsuarioService,
    //private galeriaPage: GaleriaPage
  ) { 
    this.storage.create();
  }


  getServiciosAbiertos(opcion: boolean): any {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      const usuario = await this.usuarioService.getUsuario();
      this.http.get(`${empresa.url}/api/servicios/servicios/abiertos/proveedor/${usuario.usuarioId}/${opcion}`)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }
  getServicio(servicioId: number): any {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.get(`${empresa.url}/api/servicios/detalle/mobil/${servicioId}`)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }

  getParte(parteId: number): any {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.get(`${empresa.url}/api/partes/del/proveedor/${parteId}`)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }

  getPartesProveedor(proveedorId: number, opcion: boolean, fecha: any, hFecha: any, direccionTrabajo: string ): any {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.get(`${empresa.url}/api/partes/del/proveedor/${proveedorId}/${opcion}/${fecha}/${hFecha}/${direccionTrabajo}`)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }

  getPartesServicio(servicioId: number, proveedorId: number): any {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.get(`${empresa.url}/api/partes/servicio/${servicioId}/${proveedorId}`)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }

  
  getTrabajosParte(parteId: number): any {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.get(`${empresa.url}/api/partes/lineas/del/parte/servicio/movil/${parteId}`)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }

  getEstadosParte(): any {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.get(`${empresa.url}/api/estados_parte_profesional`)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }

  getEstadosParteEstado(estado: String): any {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.get(`${empresa.url}/api/estados_parte_profesional/movil/${estado}`)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }
  getTiposGarantia(): any {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.get(`${empresa.url}/api/tipos_garantia`)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }

  getTiposProfesionalesProveedor(): any {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      const usuario = await this.usuarioService.getUsuario();
      this.http.get(`${empresa.url}/api/proveedores/profesiones/asociadas/todas/${usuario.usuarioId}`)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }

  getArticulos(): any {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      const usuario = await this.usuarioService.getUsuario();
      this.http.get(`${empresa.url}/api/proveedores/profesiones/asociadas/todas/${usuario.usuarioId}`)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }
  
  getTarifaProveedorProfesion(tipoPro:number, parArt:string): any {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      const usuario = await this.usuarioService.getUsuario();
      this.http.get(`${empresa.url}/api/tarifas_proveedor/articulos/proveedor/${usuario.usuarioId}/${tipoPro}/${parArt}`)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }

  getTarifaProveedorProfesionCodigo(tipoPro:number, cod:string): any {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      const usuario = await this.usuarioService.getUsuario();
      this.http.get(`${empresa.url}/api/tarifas_proveedor/articulos/proveedor/por/codigo/${usuario.usuarioId}/${tipoPro}/${cod}`)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }

  getTarifaProveedorProfesionCodigoNombre(tipoPro:number, parArt:string, cod:string): any {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      const usuario = await this.usuarioService.getUsuario();
      this.http.get(`${empresa.url}/api/tarifas_proveedor/articulos/proveedor/por/codigo/nombre/${usuario.usuarioId}/${tipoPro}/${cod}/${parArt}`)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }

  /* getTarifaProveedorProfesionCodigoNombre(tipoPro: number, parArt: string, cod: string): any {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      const usuario = await this.usuarioService.getUsuario();
      
      this.http.get(`${empresa.url}/api/tarifas_proveedor/articulos/proveedor/por/codigo/nombre/${usuario.usuarioId}/${tipoPro}/${cod}/${parArt}`)
        .pipe(
          timeout(5000), // Tiempo de espera de 5000 ms
          catchError((error: HttpErrorResponse) => {
            let errorMessage = 'Unknown error!';
            if (error.error instanceof ErrorEvent) {
              // Error del lado del cliente
              errorMessage = `Error: ${error.error.message}`;
            } else {
              // Error del lado del servidor
              errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
            }
            return throwError(errorMessage);
          })
        )
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (err) => {
            reject(err);
          }
        );
    });
  } */
  

  getPrecioUnitarioCliente(clienteId:number, cod:string): any {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.get(`${empresa.url}/api/clientes/tarifa/por/codigo/${clienteId}/${cod}`)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }

  
  getDatosCliente(clienteId:number): any {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.get(`${empresa.url}/api/clientes/${clienteId}`)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }

  getTiposProyecto(usuId: number, departaMentoId:number, visible: boolean): any {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.get(`${empresa.url}/api/tipos_proyectos/departamento/visible-movil/profesion/${usuId}/${departaMentoId}/${visible}`)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }

  getAgente(id: number): any {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.get(`${empresa.url}/api/comerciales//${id}`)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }

  getRappelAgente(agenteId: number, clienteId: number, empresaId: number, departaMentoId: number,): any {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.get(`${empresa.url}/api/comerciales/comision/${agenteId}/${clienteId}/${empresaId}/${departaMentoId}`)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }

  getTiposIva(): any {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.get(`${empresa.url}/api/tipos_iva`)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }

  
  postParte(data: object) {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.post(`${empresa.url}/api/partes/`, data)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }

  putParte(id: number, data: object) {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.put(`${empresa.url}/api/partes/${id}`, data)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }

  putParteSinAsignar(servicioId: number, data: object) {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.put(`${empresa.url}/api/partes/sin/asignar/${servicioId}`, data)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }

  deleteParte(id: number) {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.delete(`${empresa.url}/api/partes/${id}`)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }

  deleteTrabajo(lineaParteId: number, parteId: number, servicioId: number) {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.delete(`${empresa.url}/api/partes/linea/${lineaParteId}/${parteId}/${servicioId}`)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }



  putServicio(id: number, data: object) {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.put(`${empresa.url}/api/servicios/${id}`, data)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }

  postTrabajo(parteId: number, servicioId: number, data: object) {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.post(`${empresa.url}/api/partes/linea/${parteId}/${servicioId}`, data)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }

  putTrabajo(parteLineaId: number, servicioId: number, data: object) {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.put(`${empresa.url}/api/partes/linea/${parteLineaId}/${servicioId}`, data)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }

  getLocalesAfectadosServicioParte(servicioId: number, parteId: number) {
    return new Promise(async (resolve, reject)  => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.get(`${empresa.url}/api/locales_afectados/servicio/parte/${servicioId}/${parteId}`)
            .subscribe(async (resp: any) => {
              resolve(resp);
            },
            err => {
              reject(err);
            })
          })
            
}
  // NOTIFICACIONES

  getNotificacionesUsuario(): any {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      const usuario = await this.usuarioService.getUsuario();
      this.http.get(`${empresa.url}/api/mensajes/usuario/${usuario.usuarioId}`)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }

  getNotificacionesUsuarioPush(): any {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      const usuario = await this.usuarioService.getUsuario();
      this.http.get(`${empresa.url}/api/mensajes/usuario/push/${usuario.usuarioId}/${usuario.proveedorUsuarioPushId}`)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }

  getNotificacion(mensajeId: number): any {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.get(`${empresa.url}/api/mensajes/${mensajeId}`)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }

  putEstado(mensajeId: number, proveedorId: number, data: object) {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.put(`${empresa.url}/api/mensajes/${mensajeId}/${proveedorId}`, data)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }

  putEstadoPush(mensajeId: number, proveedorId: number, data: object) {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.put(`${empresa.url}/api/mensajes/push/${mensajeId}/${proveedorId}/`, data)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }

  sendNotificacionWeb(data: object)  {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.post(`${empresa.url}/api/mensajes/send/webPush`, data)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }

  enviarCorreo(data: object)  {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.post(`${empresa.url}/api/partes/enviar/correo/aceptar/cancelar/parte/general`, data)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }

  enviarCorreoCerrado(data: object)  {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.post(`${empresa.url}/api/partes/enviar/correo/cierre/parte`, data)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }

  //FOTOS

  postParteFotos(data: object) {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.post(`${empresa.url}/api/partes/guarda/fotos/del/parte`, data)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }

  getParteFotos(parteId: number): any {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.get(`${empresa.url}/api/partes/recupera/fotos/del/parte/${parteId}`)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }

  //CREAR Y SUBIR PARTE STIMULSOFT
  creaPartePdf(servicioId: number, parteId: number): any {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.get(`${empresa.url}/api/partes/crea/parte/movil/pdf/${servicioId}/${parteId}`)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }

  //CREAR Y SUBIR PARTE STIMULSOFT
  creaPartePdfCodigo(servicioId: number, parteId: number, codigo: number): any {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.get(`${empresa.url}/api/partes/crea/parte/movil/pdf/codigo/${servicioId}/${parteId}/${codigo}`)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }

  
  //CREAR Y SUBIR PARTE STIMULSOFT
  putParteCreaPdf(servicioId: number, parteId: number, parte: any, codigo: number): any {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.put(`${empresa.url}/api/partes/putParte/crea/pdf/${servicioId}/${parteId}/${codigo}`, parte)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }

 
  decodeData(data:any): any {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.post(`${empresa.url}/api/partes/decodifica/datos/del/parte/b64`, data)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })

  }

  decodeBlob(formData: FormData) {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.post(`${empresa.url}/api/partes/decodifica/datos/del/parte/decode-blob`, formData)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }
  
 

  decodeFirma(data:any) {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.post(`${empresa.url}/api/partes/decodifica/firma/del/parte/b64/jpg`, data)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })

  }

  //OFERTAS
  getPresupuestosProveedor(proveedorId: number, estadoId: number, dFecha: Date, hFecha: Date, direccionTrabajo: string): any {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.get(`${empresa.url}/api/ofertas/del/proveedor/${proveedorId}/${estadoId}/${dFecha}/${hFecha}/${direccionTrabajo}`)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          });
    });
  }
  getPresupuestoProveedor(ofertaId: number): any {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.get(`${empresa.url}/api/oferta/del/proveedor/${ofertaId}`)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          });
    });
  }

  getPresupuestoParte(data: any): any {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.post(`${empresa.url}/api/ofertas/del/parte/`, data)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          });
    });
  }
  postOferta(data: any): any {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.post(`${empresa.url}/api/ofertas/vincula/parte`, data)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    });

  }

  putOferta(data: any, ofertaId:number): any {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.put(`${empresa.url}/api/ofertas/${ofertaId}`, data)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    });

  }


  
  putOfertaActualizaParte(data: any, ofertaId:number): any {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.put(`${empresa.url}/api/ofertas/actualiza/parte`, data)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    });

  }

  obtenerReferencia(empresaId: number, rappel: number, ano:number): any {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.get(`${empresa.url}/api/ofertas/siguiente_referencia/reparaciones/${empresaId}/${rappel}/${ano}`)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          });
    });
  }

  postOfertaTrabajo(data: object) {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.post(`${empresa.url}/api/ofertas/lineas-transform/`, data)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  };

  putOfertaTrabajo(ofertaLineaId: number, data: object) {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.put(`${empresa.url}/api/ofertas/lineas-transform/${ofertaLineaId}`, data)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }

  
  putOfertaLinea(ofertaLineaId: number, data: object) {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.put(`${empresa.url}/api/ofertas/lineas/${ofertaLineaId}`, data)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }

  getTrabajos(ofertaId: number, proveedorId: number): any {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.get(`${empresa.url}/api/ofertas/lineas/${ofertaId}/${proveedorId}`)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          });
    });
  }

  
  deleteOfertaLinea(ofertaLineaId: number, data: object) {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.post(`${empresa.url}/api/ofertas/lineas/delete/${ofertaLineaId}`, data)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }

  enviarCorreoGeneral(data: object)  {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.post(`${empresa.url}/api/ofertas/enviar/correo`, data)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }

  getIndicesCorrectoresProfesional(proveedorId: number, tipoProfesionalId: number): any {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.get(`${empresa.url}/api/proveedores/indices-correctores/proveedor/${proveedorId}/${tipoProfesionalId}`)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          });
    });
  }

  getParteOfertaProveedor(data: any): any {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.post(`${empresa.url}/api/partes/get/parte/oferta/proveedor`, data)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }

  
  crearMrt(data: any): any {
    return new Promise(async (resolve, reject) => {
      const empresa = await this.empresaService.getEmpresa();
      this.http.post(`${empresa.url}/api/ofertas/genera/mrt/oferta/proveedor`, data)
        .subscribe(async (resp: any) => {
          resolve(resp);
        },
          err => {
            reject(err);
          })
    })
  }

  descargaPdf(datos: any) {
    return new Promise(async (resolve, reject) => {
      const fileUrl = datos.url;

      this.http.get(fileUrl, { responseType: 'blob' })
      .subscribe((blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = datos.nomfich;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        resolve('OK')
      }, err => {
        reject(err);
      });
    });
  }





  /////////////////////////////////////////////

  
  

  async guardarEstadoCheck(estado: boolean) {
    await this.storage.set('estado-check', estado);
  }

  async getEstadoCheck() {
    const estado = await this.storage.get('estado-check');
    return estado;
  }

  async borrarEstadoCheck() {
    await this.storage.remove('estado-check');
  }

  async guardarEstadoCheckPresupuesto(estado: any) {
    await this.storage.set('estado-check-presupuesto', estado);
  }

  async getEstadoCheckPresupuesto() {
    const estado = await this.storage.get('estado-check-presupuesto');
    return estado;
  }

  async borrarEstadoCheckPresupuesto() {
    await this.storage.remove('estado-check-presupuesto');
  }

  async guardarServicioDetalle(servicio: any) {
    await this.storage.set('comercializa-servicio-detalle', servicio);
  }

  async getServicioDetalle() {
    const servicio = await this.storage.get('comercializa-servicio-detalle');
    return servicio;
  }

  async borrarServicioDetalle() {
    await this.storage.remove('comercializa-servicio-detalle');
  }

  /* async guardarParteDetalle(parte) {
    await this.storage.set('comercializa-parte-detalle', parte);
  }
 */
 


/*   async borrarParteDetalle() {
    await this.storage.remove('comercializa-parte-detalle');
  } */


  /* async getParteDetalle() {
    const parte = await this.storage.get('comercializa-parte-detalle');
    return parte;
  } */

  guardarParteDetalleObj(parte: {}) {
    this.parte = parte;
  }

  getParteDetalleObj() {
    const parte = this.parte;
    if (!parte.hasOwnProperty('parteId')) return null;
    return parte;
  }

  borrarParteDetalleObj() {
    this.parte = {};
  }
  

  guardarTrabajoDetalleObj(trabajo: {}) {
    this.trabajo = trabajo;
  }

  borrarTrabajoDetalleObj() {
    this.trabajo = {};
  }

  getTrabajoDetalleObj() {
    const trabajo = this.trabajo
    if (!trabajo.hasOwnProperty('parteLineaId')) return null;
    return trabajo;
  }

  guardarPresupuestoDetalleObj(p: {}) {
    this.presupuesto = p;
  }

  getPresupuestoDetalleObj() {
    const presupuesto = this.presupuesto;
    if (!presupuesto.hasOwnProperty('ofertaId')) return null;
    return presupuesto;
  }

  borrarPresupuestoDetalleObj() {
    this.presupuesto = {};
  }

  guardarPresupuestoTrabajoDetalleObj(trabajo: {}) {
    this.presupuestoTrabajo = trabajo;
  }

  borrarPresupuestoTrabajoDetalleObj() {
    this.presupuestoTrabajo = {};
  }

  getPresupuestoTrabajoDetalleObj() {
    const trabajo = this.presupuestoTrabajo
    if (!trabajo.hasOwnProperty('ofertaLineaId')) return null;
    return trabajo;
  }


 /*  async guardarTrabajoDetalle(trabajo) {
    await this.storage.set('comercializa-trabajo-detalle', trabajo);
  }

  async borrarTrabajoDetalle() {
    await this.storage.remove('comercializa-trabajo-detalle');
  }

  async getTrabajoDetalle() {
    const trabajo = await this.storage.get('comercializa-trabajo-detalle');
    return trabajo;
  } */

 /*  async guardarMensajeDetalle(mensaje) {
    await this.storage.set('comercializa-mensaje-detalle', mensaje);
  }

  async getMensajeDetalle() {
    const mensaje = await this.storage.get('comercializa-mensaje-detalle');
    return mensaje;
  }

  async borrarMensajeDetalle() {
    await this.storage.remove('comercializa-mensaje-detalle');
  }
 */
  guardarMensajeDetalleObj(mensaje: {}) {
    this.mensaje = mensaje;
  }

  borrarMensajeDetalleObj() {
    this.mensaje = {};
  }

  getMensajeDetalleObj() {
    const mensaje = this.mensaje;
    if (!mensaje.hasOwnProperty('mensajeId')) return null;
    return mensaje;
  }

  async guardarFiltroParte(filtro: any) {
    await this.storage.set('comercializa-filtro-parte', filtro);
  }

  async getFiltroParte() {
    const filtroParte = await this.storage.get('comercializa-filtro-parte');
    return filtroParte;
  }

  async borrarFiltroParte() {
    await this.storage.remove('comercializa-filtro-parte');
  }


  async guardarFiltroPresupuesto(filtro: any) {
    await this.storage.set('comercializa-filtro-presupuesto', filtro);
  }

  async getFiltroPresupuesto() {
    const filtroParte = await this.storage.get('comercializa-filtro-presupuesto');
    return filtroParte;
  }

  async borrarFiltroPresupuesto() {
    await this.storage.remove('comercializa-filtro-presupuesto');
  }

  async getImagenDetalle() {
    const imagen = await this.storage.get('comercializa-imagen-detalle');
    return imagen;
  }

  async guardarImagenDetalle(imagen: any) {
    await this.storage.set('comercializa-imagen-detalle', imagen);
  }

  async borrarImagenDetalle() {
    await this.storage.remove('comercializa-imagen-detalle');
  }


  async guardarImagenData(imagen: any) {
    await this.storage.set('comercializa-imagen', imagen);
  }

  async borrarImagenData() {
    await this.storage.remove('comercializa-imagen');
  }

  async getImagenData() {
    const imagen = await this.storage.get('comercializa-imagen');
    return imagen;
  }

  async guardarAntParte(antParte:any) {
    await this.storage.set('comercializa-antParte', antParte);
  }

  async borrarAntParte() {
    await this.storage.remove('comercializa-antParte');
  }

  async getAntParte() {
    const antParte = await this.storage.get('comercializa-antParte');
    return antParte;
  }


}
