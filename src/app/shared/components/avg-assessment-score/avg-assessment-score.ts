import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NgxEchartsDirective } from 'ngx-echarts';
import { Subject, takeUntil } from 'rxjs';
import { DashboardService } from '../../../services/dashboard.service';
import { AssessmentScoreModel } from '../../../model';
import { EChartsOption } from 'echarts';
import { Store } from '@ngrx/store';
import { selectYear } from '../../../store';

@Component({
  selector: 'app-avg-assessment-score',
  imports: [CommonModule, MatCardModule, NgxEchartsDirective],
  templateUrl: './avg-assessment-score.html',
  styleUrl: './avg-assessment-score.scss',
})
export class AvgAssessmentScore implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  private dashboardService = inject(DashboardService);
  private store = inject(Store);
  assessmentScore: WritableSignal<AssessmentScoreModel | null> = signal(null);
  option: WritableSignal<EChartsOption | null> = signal(null);

  ngOnInit(): void {
    this.store
      .select(selectYear)
      .pipe(takeUntil(this.destroy$))
      .subscribe((year) => {
        this.getAvgAssessmentScore(year);
      });
  }

  getAvgAssessmentScore(year: string) {
    this.dashboardService
      .getAvgAssessmentScore(year)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.assessmentScore.set(data);
        if (data) {
          this.buildChartOption(data);
        }
      });
  }

  buildChartOption(data: AssessmentScoreModel) {
    const isDark = false;

    const option: EChartsOption = {
      animationDuration: 800,
      animationEasing: 'cubicOut',
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      tooltip: {
        trigger: 'item',
      },
      legend: {
        show: false,
      },
      series: [
        {
          name: 'Assessment Score',
          type: 'pie',
          radius: ['50%', '70%'],
          data: this.getSeriesData(data),
          label: {
            show: true,
            formatter: (params: any) => `${params.value}%  ${params.name}`,
          },
        },
      ],

      graphic: [
        {
          type: 'text',
          left: 'center',
          top: 'middle',
          style: {
            text: 'All Districts',
            fontSize: 16,
            fontWeight: 700,
            lineHeight: 24,
            fill: isDark ? '#e5e7eb' : '#6b7280',
          },
        },
      ],
    };

    this.option.set(option);
  }

  getSeriesData(data: AssessmentScoreModel) {
    const arr = (Object.keys(data) as (keyof AssessmentScoreModel)[]).map((key) => {
      const item = {
        name: key == 'completedPercent' ? 'Assessment Completed' : 'Assessment not Completed',
        value: data[key],
      };

      return item;
    });

    return arr;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
