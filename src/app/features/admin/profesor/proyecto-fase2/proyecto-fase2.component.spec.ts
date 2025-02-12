import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectoFase2Component } from './proyecto-fase2.component';

describe('ProyectoFase2Component', () => {
  let component: ProyectoFase2Component;
  let fixture: ComponentFixture<ProyectoFase2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProyectoFase2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProyectoFase2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
