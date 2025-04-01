import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalBusquedaArticulosPage } from './modal-busqueda-articulos.page';

describe('ModalBusquedaArticulosPage', () => {
  let component: ModalBusquedaArticulosPage;
  let fixture: ComponentFixture<ModalBusquedaArticulosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalBusquedaArticulosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalBusquedaArticulosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
