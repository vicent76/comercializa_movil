import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from 'src/app/components/components.module';

import { ParteDetallePageRoutingModule } from './parte-detalle-routing.module';

import { ParteDetallePage } from './parte-detalle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ParteDetallePageRoutingModule,
    ComponentsModule
  ],
  declarations: [ParteDetallePage]
})
export class ParteDetallePageModule {}
