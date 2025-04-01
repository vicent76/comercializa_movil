import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PresupuestoDetallePage } from './presupuesto-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: PresupuestoDetallePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PresupuestoDetallePageRoutingModule {}
