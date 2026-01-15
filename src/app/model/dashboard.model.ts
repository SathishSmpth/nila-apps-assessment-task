export interface DashboardModel {
  summary: Summary;
  courseProgress: CourseProgressModel[];
  passStats: PassStatsModel;
  assessmentCompletion: AssessmentScoreModel;
  gradeBreakdown: GradeBreakdownModel[];
  districtRanking: DistrictRankingModel;
}

export interface Summary {
  totalLearners: number;
  male: number;
  female: number;
  others: number;
  activeLearners: number;
  engagedLearners: number;
}

export interface CourseProgressModel {
  district: string;
  below: number;
  average: number;
  good: number;
}

export interface PassStatsModel {
  overallLearners: number;
  assessmentTaken: number;
  passed: number;
  failed: number;
}

export interface AssessmentScoreModel {
  completedPercent: number;
  notCompletedPercent: number;
}

export interface GradeBreakdownModel {
  grade: string;
  label: string;
  percent: number;
}

export interface DistrictRankingModel {
  rankBy: string;
  districts: DistrictsModel[];
}

export interface DistrictsModel {
  district: string;
  rank: number;
  enrolled: number;
  male: number;
  female: number;
  others: number;
  passed: number;
  failed: number;
  assessmentCompleted: number;
  completionRatePercent: number;
}
