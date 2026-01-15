import { Component, inject, OnInit } from '@angular/core';
import { Header } from '../../shared';
import { CourseProgressRate } from '../../shared/components/course-progress-rate/course-progress-rate';
import { PassPercentage } from '../../shared/components/pass-percentage/pass-percentage';
import { AvgAssessmentScore } from '../../shared/components/avg-assessment-score/avg-assessment-score';
import { LearnerDetails } from '../../shared/components/learner-details/learner-details';
import { EnrolledDetail } from '../../shared/components/enrolled-detail/enrolled-detail';
import { DistrictRanking } from "../../shared/components/district-ranking/district-ranking";

@Component({
  selector: 'app-home-page',
  imports: [
    Header,
    CourseProgressRate,
    PassPercentage,
    AvgAssessmentScore,
    LearnerDetails,
    EnrolledDetail,
    DistrictRanking
],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage implements OnInit {
  ngOnInit(): void {}
}
