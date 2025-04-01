import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/components.module';

import { IonicModule } from '@ionic/angular';

import { PresupuestoTrabajoDetallePageRoutingModule } from './presupuesto-trabajo-detalle-routing.module';

import { PresupuestoTrabajoDetallePage } from './presupuesto-trabajo-detalle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PresupuestoTrabajoDetallePageRoutingModule,
    ComponentsModule
  ],
  declarations: [PresupuestoTrabajoDetallePage]
})
export class PresupuestoTrabajoDetallePageModule {}
