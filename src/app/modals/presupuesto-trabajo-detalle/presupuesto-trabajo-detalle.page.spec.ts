import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PresupuestoTrabajoDetallePage } from './presupuesto-trabajo-detalle.page';

describe('PresupuestoTrabajoDetallePage', () => {
  let component: PresupuestoTrabajoDetallePage;
  let fixture: ComponentFixture<PresupuestoTrabajoDetallePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PresupuestoTrabajoDetallePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PresupuestoTrabajoDetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
