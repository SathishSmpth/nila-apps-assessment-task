import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictRanking } from './district-ranking';

describe('DistrictRanking', () => {
  let component: DistrictRanking;
  let fixture: ComponentFixture<DistrictRanking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistrictRanking]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistrictRanking);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
