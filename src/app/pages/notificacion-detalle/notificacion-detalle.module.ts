import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotificacionDetallePageRoutingModule } from './notificacion-detalle-routing.module';

import { ComponentsModule } from 'src/app/components/components.module';

import { NotificacionDetallePage } from './notificacion-detalle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotificacionDetallePageRoutingModule,
    ComponentsModule

  ],
  declarations: [NotificacionDetallePage]
})
export class NotificacionDetallePageModule {}
