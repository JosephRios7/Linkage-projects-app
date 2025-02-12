import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvocatoriasProfeComponent } from './convocatoriasProfe.component';

describe('ConvocatoriasComponent', () => {
  let component: ConvocatoriasProfeComponent;
  let fixture: ComponentFixture<ConvocatoriasProfeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConvocatoriasProfeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConvocatoriasProfeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
