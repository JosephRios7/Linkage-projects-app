import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderProfeComponent } from './header-profe.component';

describe('HeaderComponent', () => {
  let component: HeaderProfeComponent;
  let fixture: ComponentFixture<HeaderProfeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderProfeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderProfeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
