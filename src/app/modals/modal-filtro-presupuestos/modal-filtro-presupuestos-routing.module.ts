import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalFiltroPresupuestosPage } from './modal-filtro-presupuestos.page';

const routes: Routes = [
  {
    path: '',
    component: ModalFiltroPresupuestosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalFiltoPresupuestosPageRoutingModule {}
