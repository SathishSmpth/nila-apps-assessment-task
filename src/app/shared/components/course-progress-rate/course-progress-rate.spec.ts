import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseProgressRate } from './course-progress-rate';

describe('CourseProgressRate', () => {
  let component: CourseProgressRate;
  let fixture: ComponentFixture<CourseProgressRate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseProgressRate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseProgressRate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
