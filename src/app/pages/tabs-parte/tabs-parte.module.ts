import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabsPartePageRoutingModule } from './tabs-parte-routing.module';

import { TabsPartePage } from './tabs-parte.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabsPartePageRoutingModule
  ],
  declarations: [TabsPartePage]
})
export class TabsPartePageModule {}
