import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalBusquedaArticulosPage } from './modal-busqueda-articulos.page';

const routes: Routes = [
  {
    path: '',
    component: ModalBusquedaArticulosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalBusquedaArticulosPageRoutingModule {}
