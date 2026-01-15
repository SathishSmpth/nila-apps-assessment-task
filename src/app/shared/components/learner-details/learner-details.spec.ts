import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnerDetails } from './learner-details';

describe('LearnerDetails', () => {
  let component: LearnerDetails;
  let fixture: ComponentFixture<LearnerDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearnerDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearnerDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
