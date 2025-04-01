import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MenuCardComponent } from './menu-card/menu-card.component';
import { MenuListComponent } from './menu-list/menu-list.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MenuComponent } from './menu/menu.component';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { ErrorComponent } from './error/error.component';
import { CabeceraComponent } from './cabecera/cabecera.component';



@NgModule({
  declarations: [
    MenuCardComponent,
    MenuListComponent,
    HeaderComponent,
    FooterComponent,
    MenuComponent,
    MenuItemComponent,
    ErrorComponent,
    CabeceraComponent
  ],
  exports: [
    MenuCardComponent,
    MenuListComponent,
    HeaderComponent,
    FooterComponent,
    MenuComponent,
    MenuItemComponent,
    ErrorComponent,
    CabeceraComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class ComponentsModule { }
