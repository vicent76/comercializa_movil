import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PresupuestoDetallePage } from './presupuesto-detalle.page';

describe('PresupuestoDetallePage', () => {
  let component: PresupuestoDetallePage;
  let fixture: ComponentFixture<PresupuestoDetallePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PresupuestoDetallePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PresupuestoDetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
