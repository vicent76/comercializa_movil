import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrabajoDetallePage } from './trabajo-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: TrabajoDetallePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrabajoDetallePageRoutingModule {}
