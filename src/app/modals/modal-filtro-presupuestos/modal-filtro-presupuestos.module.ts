import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalFiltoPresupuestosPageRoutingModule } from './modal-filtro-presupuestos-routing.module';

import { ModalFiltroPresupuestosPage } from './modal-filtro-presupuestos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalFiltoPresupuestosPageRoutingModule
  ],
  declarations: [ModalFiltroPresupuestosPage]
})
export class ModalFiltoPresupuestosPageModule {}
