import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InfoPartePage } from './info-parte.page';

const routes: Routes = [
  {
    path: '',
    component: InfoPartePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InfoPartePageRoutingModule {}
