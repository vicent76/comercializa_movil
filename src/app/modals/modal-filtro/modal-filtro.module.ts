import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/components.module';

import { IonicModule } from '@ionic/angular';

import { ModalFiltroPageRoutingModule } from './modal-filtro-routing.module';

import { ModalFiltroPage } from './modal-filtro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalFiltroPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ModalFiltroPage]
})
export class ModalFiltroPageModule {}
