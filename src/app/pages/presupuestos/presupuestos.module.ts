import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PresupuestosPageRoutingModule } from './presupuestos-routing.module';

import { PresupuestosPage } from './presupuestos.page';

import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PresupuestosPageRoutingModule,
    ComponentsModule
  ],
  declarations: [PresupuestosPage]
})
export class PresupuestosPageModule {}
