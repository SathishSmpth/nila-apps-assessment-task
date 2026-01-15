import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassPercentage } from './pass-percentage';

describe('PassPercentage', () => {
  let component: PassPercentage;
  let fixture: ComponentFixture<PassPercentage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PassPercentage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassPercentage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
