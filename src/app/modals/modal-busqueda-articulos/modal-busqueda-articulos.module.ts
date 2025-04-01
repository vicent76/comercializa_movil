import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalBusquedaArticulosPageRoutingModule } from './modal-busqueda-articulos-routing.module';

import { ModalBusquedaArticulosPage } from './modal-busqueda-articulos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalBusquedaArticulosPageRoutingModule
  ],
  declarations: [ModalBusquedaArticulosPage]
})
export class ModalBusquedaArticulosPageModule {}
