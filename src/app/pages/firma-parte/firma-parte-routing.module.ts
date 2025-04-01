import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FirmaPartePage } from './firma-parte.page';

const routes: Routes = [
  {
    path: '',
    component: FirmaPartePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FirmaPartePageRoutingModule {}
