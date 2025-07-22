import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'acceso',
    loadChildren: () => import('./pages/acceso/acceso.module').then( m => m.AccesoPageModule)
  },
  {
    path: 'notificaciones',
    loadChildren: () => import('./pages/notificaciones/notificaciones.module').then( m => m.NotificacionesPageModule)
  },
  {
    path: 'notificaciones',
    loadChildren: () => import('./pages/notificaciones/notificaciones.module').then( m => m.NotificacionesPageModule)
  },
  {
    path: 'partes/:id',
    loadChildren: () => import('./pages/partes/partes.module').then( m => m.PartesPageModule)
  },
  {
    path: 'tabs-parte',
    loadChildren: () => import('./pages/tabs-parte/tabs-parte.module').then( m => m.TabsPartePageModule)
  },
  {
    path: 'parte-detalle',
    loadChildren: () => import('./pages/parte-detalle/parte-detalle.module').then( m => m.ParteDetallePageModule)
  },
  {
    path: 'trabajos',
    loadChildren: () => import('./pages/trabajos/trabajos.module').then( m => m.TrabajosPageModule)
  },
  {
    path: 'trabajo-detalle',
    loadChildren: () => import('./modals/trabajo-detalle/trabajo-detalle.module').then( m => m.TrabajoDetallePageModule)
  },
  {
    path: 'modal-busqueda-articulos',
    loadChildren: () => import('./modals/modal-busqueda-articulos/modal-busqueda-articulos.module').then( m => m.ModalBusquedaArticulosPageModule)
  },
  {
    path: 'partes-tab',
    loadChildren: () => import('./pages/partes/partes.module')
    .then( m => m.PartesPageModule)
  },
  {
    path: 'parte-tab',
    loadChildren: () => import('./pages/parte-detalle/parte-detalle.module')
    .then( m => m.ParteDetallePageModule)
  },
  {
    path: 'trabajos-tab',
    loadChildren: () => import('./pages/trabajos/trabajos.module')
    .then( m => m.TrabajosPageModule)
  },
  {
    path: 'info-parte-tab',
    loadChildren: () => import('./pages/info-parte/info-parte.module')
    .then( m => m.InfoPartePageModule)
  },
  {
    path: 'firma-tab',
    loadChildren: () => import('./pages/firma-parte/firma-parte.module')
    .then( m => m.ModalFirmaPageModule)
  },
  {
    path: 'galeria-tab',
    loadChildren: () => import('./pages/galeria/galeria.module')
    .then( m => m.GaleriaPageModule)
  },
  {
    path: 'fotos-tab',
    loadChildren: () => import('./pages/fotos/fotos.module')
    .then( m => m.FotosPageModule)
  },
  {
    path: 'notificacion-detalle/:id',
    loadChildren: () => import('./pages/notificacion-detalle/notificacion-detalle.module').then( m => m.NotificacionDetallePageModule)
  },
  {
    path: 'firma-parte',
    loadChildren: () => import('./pages/firma-parte/firma-parte.module').then( m => m.ModalFirmaPageModule)
  },
  {
    path: 'info-parte',
    loadChildren: () => import('./pages/info-parte/info-parte.module').then( m => m.InfoPartePageModule)
  },
  {
    path: 'modal-filtro',
    loadChildren: () => import('./modals/modal-filtro/modal-filtro.module').then( m => m.ModalFiltroPageModule)
  },
  {
    path: 'fotos',
    loadChildren: () => import('./pages/fotos/fotos.module').then( m => m.FotosPageModule)
  },
  {
    path: 'galeria',
    loadChildren: () => import('./pages/galeria/galeria.module').then( m => m.GaleriaPageModule)
  },
  {
    path: 'modal-foto',
    loadChildren: () => import('./modals/modal-foto/modal-foto.module').then( m => m.ModalFotoPageModule)
  },
  {
    path: 'presupuesto-detalle',
    loadChildren: () => import('./pages/presupuesto-detalle/presupuesto-detalle.module').then( m => m.PresupuestoDetallePageModule)
  },
  {
    path: 'presupuesto-trabajo-detalle',
    loadChildren: () => import('./modals/presupuesto-trabajo-detalle/presupuesto-trabajo-detalle.module').then( m => m.PresupuestoTrabajoDetallePageModule)
  },
  {
    path: 'presupuestos',
    loadChildren: () => import('./pages/presupuestos/presupuestos.module').then( m => m.PresupuestosPageModule)
  },
  {
    path: 'modal-filtro-presupuestos',
    loadChildren: () => import('./modals/modal-filtro-presupuestos/modal-filtro-presupuestos.module').then( m => m.ModalFiltoPresupuestosPageModule)
  },
 {
  path: 'tabs-parte/info-parte-tab/:id',
  loadChildren: () => import('./pages/info-parte/info-parte.module').then(m => m.InfoPartePageModule)
},


 







  
  
  


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
