import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/components.module';

import { IonicModule } from '@ionic/angular';

import { PresupuestoDetallePageRoutingModule } from './presupuesto-detalle-routing.module';

import { PresupuestoDetallePage } from './presupuesto-detalle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PresupuestoDetallePageRoutingModule,
    ComponentsModule
  ],
  declarations: [PresupuestoDetallePage]
})
export class PresupuestoDetallePageModule {}
