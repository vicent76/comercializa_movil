import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalFiltoPresupuestosPage } from './modal-filtro-presupuestos.page';

describe('ModalFiltoPresupuestosPage', () => {
  let component: ModalFiltoPresupuestosPage;
  let fixture: ComponentFixture<ModalFiltoPresupuestosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalFiltoPresupuestosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalFiltoPresupuestosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
