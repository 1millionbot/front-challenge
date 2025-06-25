import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparacionCurricularComponent } from './comparacion-curricular.component';

describe('ComparacionCurricularComponent', () => {
  let component: ComparacionCurricularComponent;
  let fixture: ComponentFixture<ComparacionCurricularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparacionCurricularComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComparacionCurricularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
