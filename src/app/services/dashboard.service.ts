import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  AssessmentScoreModel,
  CourseProgressModel,
  DashboardModel,
  DistrictRankingModel,
  DistrictsModel,
  GradeBreakdownModel,
  PassStatsModel,
} from '../model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  getDashboardData(year: string): Observable<DashboardModel> {
    return this.http.get<any>('assets/dashboard.json').pipe(map((data) => data[year]));
  }

  getDistricts(year: string) {
    return this.getDashboardData(year).pipe(
      map(({ districtRanking }: DashboardModel) =>
        districtRanking?.districts?.map(({ district }: DistrictsModel) => district)
      )
    );
  }

  getEnrolledDetails(year: string) {
    return this.getDashboardData(year).pipe(map(({ summary }: DashboardModel) => summary));
  }

  getCourseProgress(year: string): Observable<CourseProgressModel[]> {
    return this.getDashboardData(year).pipe(
      map(({ courseProgress }: DashboardModel) => courseProgress)
    );
  }

  getPassStats(year: string): Observable<PassStatsModel> {
    return this.getDashboardData(year).pipe(map(({ passStats }: DashboardModel) => passStats));
  }

  getAvgAssessmentScore(year: string): Observable<AssessmentScoreModel> {
    return this.getDashboardData(year).pipe(
      map(({ assessmentCompletion }: DashboardModel) => assessmentCompletion)
    );
  }

  getGradeBreakDown(year: string): Observable<GradeBreakdownModel[]> {
    return this.getDashboardData(year).pipe(
      map(({ gradeBreakdown }: DashboardModel) => gradeBreakdown)
    );
  }

  getDistrictRanking(year: string): Observable<DistrictRankingModel> {
    return this.getDashboardData(year).pipe(
      map(({ districtRanking }: DashboardModel) => districtRanking)
    );
  }
}
