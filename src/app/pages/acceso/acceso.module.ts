import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccesoPageRoutingModule } from './acceso-routing.module';

import { AccesoPage } from './acceso.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccesoPageRoutingModule,
    ComponentsModule
  ],
  declarations: [AccesoPage]
})
export class AccesoPageModule {}
