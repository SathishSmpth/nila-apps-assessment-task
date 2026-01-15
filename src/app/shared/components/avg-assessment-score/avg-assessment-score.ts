import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NgxEchartsDirective } from 'ngx-echarts';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { DashboardService } from '../../../services/dashboard.service';
import { AssessmentScoreModel } from '../../../model';
import { EChartsOption } from 'echarts';
import { Store } from '@ngrx/store';
import { selectDistrict, selectTheme, selectYear } from '../../../store';

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
  theme: WritableSignal<string> = signal('light');
  option: WritableSignal<EChartsOption | null> = signal(null);

  ngOnInit(): void {
    combineLatest([
      this.store.select(selectYear),
      this.store.select(selectDistrict),
      this.store.select(selectTheme),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([year, district, theme]) => {
        this.theme.set(theme);
        this.getAvgAssessmentScore(year, district);
        const data = this.assessmentScore();
        if (data) {
          this.buildChartOption(data, theme);
        }
      });
  }

  getAvgAssessmentScore(year: string, district: string) {
    this.dashboardService
      .getAvgAssessmentScore(year, district)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.assessmentScore.set(data);
        if (data) {
          this.buildChartOption(data, this.theme());
        }
      });
  }

  buildChartOption(data: AssessmentScoreModel, theme: string) {
    const isDark = theme === 'dark';

    const option: EChartsOption = {
      animationDuration: 800,
      animationEasing: 'cubicOut',
      backgroundColor: isDark ? '#031427' : '#f8f9ff',
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
