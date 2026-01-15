import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrolledDetail } from './enrolled-detail';

describe('EnrolledDetail', () => {
  let component: EnrolledDetail;
  let fixture: ComponentFixture<EnrolledDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrolledDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrolledDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
