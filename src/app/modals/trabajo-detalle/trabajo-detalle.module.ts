import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/components.module';

import { IonicModule } from '@ionic/angular';

import { TrabajoDetallePageRoutingModule } from './trabajo-detalle-routing.module';

import { TrabajoDetallePage } from './trabajo-detalle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrabajoDetallePageRoutingModule,
    ComponentsModule
  ],
  declarations: [TrabajoDetallePage]
})
export class TrabajoDetallePageModule {}
