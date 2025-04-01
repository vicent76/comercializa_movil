import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PresupuestoTrabajoDetallePage } from './presupuesto-trabajo-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: PresupuestoTrabajoDetallePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PresupuestoTrabajoDetallePageRoutingModule {}
