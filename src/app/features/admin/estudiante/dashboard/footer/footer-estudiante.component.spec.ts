import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterEstudianteComponent } from './footer-estudiante.component';

describe('FooterComponent', () => {
  let component: FooterEstudianteComponent;
  let fixture: ComponentFixture<FooterEstudianteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterEstudianteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
