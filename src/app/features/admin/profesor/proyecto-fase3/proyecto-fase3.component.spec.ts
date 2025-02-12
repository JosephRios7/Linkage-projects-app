import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectoFase3Component } from './proyecto-fase3.component';

describe('ProyectoFase3Component', () => {
  let component: ProyectoFase3Component;
  let fixture: ComponentFixture<ProyectoFase3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProyectoFase3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProyectoFase3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
