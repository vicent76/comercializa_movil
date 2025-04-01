import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/components.module';

import { IonicModule } from '@ionic/angular';

import { FirmaPartePageRoutingModule } from './firma-parte-routing.module';

import { FirmaPartePage } from './firma-parte.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FirmaPartePageRoutingModule,
    ComponentsModule
  ],
  declarations: [FirmaPartePage]
})
export class ModalFirmaPageModule {}
