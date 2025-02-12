import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectosDetalleComponent } from './proyectos-detalle.component';

describe('ProyectosDetalleComponent', () => {
  let component: ProyectosDetalleComponent;
  let fixture: ComponentFixture<ProyectosDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProyectosDetalleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProyectosDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
