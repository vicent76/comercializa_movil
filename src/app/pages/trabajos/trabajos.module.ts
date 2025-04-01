import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from 'src/app/components/components.module';

import { TrabajosPageRoutingModule } from './trabajos-routing.module';

import { TrabajosPage } from './trabajos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrabajosPageRoutingModule,
    ComponentsModule
  ],
  declarations: [TrabajosPage]
})
export class TrabajosPageModule {}
