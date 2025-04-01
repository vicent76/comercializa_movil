import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPartePage } from './tabs-parte.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPartePage
,
children: [
  {
    path: 'parte-tab/:id',
    loadChildren: () => import('../parte-detalle/parte-detalle.module')
    .then( m => m.ParteDetallePageModule)
  },
  {
    path: 'trabajos-tab',
    loadChildren: () => import('../trabajos/trabajos.module')
    .then( m => m.TrabajosPageModule)
  },
  {
    path: 'info-parte-tab/:id',
    loadChildren: () => import('../info-parte/info-parte.module')
    .then( m => m.InfoPartePageModule)
  },
  {
    path: 'firma-tab',
    loadChildren: () => import('../firma-parte/firma-parte.module')
    .then( m => m.ModalFirmaPageModule)
  },
  {
    path: 'fotos-tab',
    loadChildren: () => import('../fotos/fotos.module')
    .then( m => m.FotosPageModule)
  },
  {
    path: 'galeria-tab',
    loadChildren: () => import('../galeria/galeria.module')
    .then( m => m.GaleriaPageModule)
  },
  {
    path: 'presupuesto-tab',
    loadChildren: () => import('../presupuesto-detalle/presupuesto-detalle.module')
    .then( m => m.PresupuestoDetallePageModule)
  }
]  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPartePageRoutingModule {}
