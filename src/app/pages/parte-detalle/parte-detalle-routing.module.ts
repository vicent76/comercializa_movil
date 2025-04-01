import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParteDetallePage } from './parte-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: ParteDetallePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParteDetallePageRoutingModule {}
