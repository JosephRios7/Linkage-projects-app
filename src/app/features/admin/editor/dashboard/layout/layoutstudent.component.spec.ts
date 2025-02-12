import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutstudentComponent } from './layoutstudent.component';

describe('LayoutComponent', () => {
  let component: LayoutstudentComponent;
  let fixture: ComponentFixture<LayoutstudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutstudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutstudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
