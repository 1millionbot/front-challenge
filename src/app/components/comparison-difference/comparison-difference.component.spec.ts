import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparisonDifferenceComponent } from './comparison-difference.component';

describe('ComparisonDifferenceComponent', () => {
  let component: ComparisonDifferenceComponent;
  let fixture: ComponentFixture<ComparisonDifferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparisonDifferenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComparisonDifferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
