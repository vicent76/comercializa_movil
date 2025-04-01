import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InfoPartePageRoutingModule } from './info-parte-routing.module';

import { InfoPartePage } from './info-parte.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InfoPartePageRoutingModule,
    ComponentsModule
  ],
  declarations: [InfoPartePage]
})
export class InfoPartePageModule {}
