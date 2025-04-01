import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalFotoPageRoutingModule } from './modal-foto-routing.module';

import { ModalFotoPage } from './modal-foto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalFotoPageRoutingModule
  ],
  declarations: [ModalFotoPage]
})
export class ModalFotoPageModule {}
