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

  getEnrolledDetails(year: string, district?: string) {
    return this.getDashboardData(year).pipe(
      map(({ summary, districtRanking }: DashboardModel) => {
        if (district !== 'All District') {
          const selectedDistrict = districtRanking?.districts?.find((d) => d.district === district);

          return {
            totalLearners: selectedDistrict?.enrolled,
            male: selectedDistrict?.male,
            female: selectedDistrict?.female,
            others: selectedDistrict?.others,
            activeLearners: '--',
            engagedLearners: '--',
          };
        }
        return summary;
      })
    );
  }

  getCourseProgress(year: string): Observable<CourseProgressModel[]> {
    return this.getDashboardData(year).pipe(
      map(({ courseProgress }: DashboardModel) => courseProgress)
    );
  }

  getPassStats(year: string, district?: string): Observable<PassStatsModel> {
    return this.getDashboardData(year).pipe(
      map(({ passStats, districtRanking }: DashboardModel) => {
        if (district !== 'All District') {
          const selectedDistrict = districtRanking?.districts?.find((d) => d.district === district);
          if (selectedDistrict) {
            return {
              overallLearners: selectedDistrict?.enrolled,
              assessmentTaken: selectedDistrict?.assessmentCompleted,
              passed: selectedDistrict?.passed,
              failed: selectedDistrict?.failed,
            };
          }
        }
        return passStats;
      })
    );
  }

  getAvgAssessmentScore(year: string, district?: string): Observable<AssessmentScoreModel> {
    return this.getDashboardData(year).pipe(
      map(({ assessmentCompletion, districtRanking }: DashboardModel) => {
        if (district !== 'All District') {
          const selectedDistrict = districtRanking?.districts?.find((d) => d.district === district);
          if (selectedDistrict) {
            return {
              completedPercent: selectedDistrict?.completionRatePercent,
              notCompletedPercent: 100 - selectedDistrict?.completionRatePercent,
            };
          }
        }

        return assessmentCompletion;
      })
    );
  }

  getGradeBreakDown(year: string): Observable<GradeBreakdownModel[]> {
    return this.getDashboardData(year).pipe(
      map(({ gradeBreakdown }: DashboardModel) => gradeBreakdown)
    );
  }

  getDistrictRanking(year: string, district?: string): Observable<DistrictRankingModel> {
    return this.getDashboardData(year).pipe(
      map(({ districtRanking }: DashboardModel) => {
        if (district !== 'All District') {
          const selectedDistrict = districtRanking?.districts?.filter(
            (d) => d.district === district
          );
          if (selectedDistrict) {
            return {
              ...districtRanking,
              districts: selectedDistrict,
            };
          }
        }

        return districtRanking;
      })
    );
  }
}
