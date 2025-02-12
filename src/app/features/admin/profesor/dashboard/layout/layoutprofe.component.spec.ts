import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutprofeComponent } from './layoutprofe.component';

describe('LayoutComponent', () => {
  let component: LayoutprofeComponent;
  let fixture: ComponentFixture<LayoutprofeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutprofeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutprofeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
