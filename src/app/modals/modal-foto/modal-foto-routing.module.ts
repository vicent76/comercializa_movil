import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalFotoPage } from './modal-foto.page';

const routes: Routes = [
  {
    path: '',
    component: ModalFotoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalFotoPageRoutingModule {}
