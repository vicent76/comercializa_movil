import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PartesPageRoutingModule } from './partes-routing.module';

import { PartesPage } from './partes.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PartesPageRoutingModule, 
    ComponentsModule
  ],
  declarations: [PartesPage]
})
export class PartesPageModule {}
