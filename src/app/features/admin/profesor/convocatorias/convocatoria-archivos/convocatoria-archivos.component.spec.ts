import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvocatoriaArchivosComponent } from './convocatoria-archivos.component';

describe('ConvocatoriaArchivosComponent', () => {
  let component: ConvocatoriaArchivosComponent;
  let fixture: ComponentFixture<ConvocatoriaArchivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConvocatoriaArchivosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConvocatoriaArchivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
