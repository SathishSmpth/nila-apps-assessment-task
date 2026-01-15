import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvgAssessmentScore } from './avg-assessment-score';

describe('AvgAssessmentScore', () => {
  let component: AvgAssessmentScore;
  let fixture: ComponentFixture<AvgAssessmentScore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvgAssessmentScore]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvgAssessmentScore);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
