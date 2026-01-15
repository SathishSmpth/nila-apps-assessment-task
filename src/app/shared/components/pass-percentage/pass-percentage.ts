import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DashboardService } from '../../../services/dashboard.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective } from 'ngx-echarts';
import { PassStatsModel } from '../../../model';
import { selectYear } from '../../../store';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-pass-percentage',
  imports: [MatCardModule, CommonModule, NgxEchartsDirective],
  templateUrl: './pass-percentage.html',
  styleUrl: './pass-percentage.scss',
})
export class PassPercentage implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  private dashboardService = inject(DashboardService);
  private store = inject(Store);
  passStatsDetail: WritableSignal<PassStatsModel | null> = signal(null);
  option: WritableSignal<any> = signal(null);

  ngOnInit(): void {
    this.store
      .select(selectYear)
      .pipe(takeUntil(this.destroy$))
      .subscribe((year) => {
        this.getPassStats(year);
      });
  }

  getPassStats(year: string) {
    this.dashboardService
      .getPassStats(year)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.passStatsDetail.set(data);
        if (data) {
          this.option.set(this.buildChartOption(data));
        }
      });
  }

  buildChartOption(data: PassStatsModel) {
    const isDark = false;

    return {
      animationDuration: 800,
      animationEasing: 'cubicOut',
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
      },
      grid: {
        top: '2%',
        left: '3%',
        right: '6%',
        bottom: '8%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        max: 100,
        name: 'Performance',
        nameLocation: 'middle',
        nameTextStyle: {
          color: isDark ? '#d1d5db' : '#374151',
          fontSize: 13,
          fontWeight: 600,
        },
        axisLabel: {
          formatter: '{value}',
        },
        axisLine: {
          lineStyle: {
            color: isDark ? '#4b5563' : '#e5e7eb',
          },
        },
      },
      yAxis: {
        type: 'category',
        name: 'Pass Percentage',
        nameLocation: 'middle',
        nameRotate: 90,
        nameGap: 50,
        data: data ? Object.values(data) : [],
        nameTextStyle: {
          color: isDark ? '#d1d5db' : '#374151',
          fontSize: 13,
          fontWeight: 600,
        },
        axisLabel: {
          color: isDark ? '#d1d5db' : '#374151',
        },
        splitLine: {
          lineStyle: {
            color: isDark ? '#374151' : '#f3f4f6',
          },
        },
      },
      series: [
        {
          type: 'bar',
          barWidth: '50%',
          data: [
            Math.round((data.failed / data.assessmentTaken) * 100),
            Math.round((data.passed / data.assessmentTaken) * 100),
            Math.round((data.assessmentTaken / data.overallLearners) * 100),
            100,
          ],
          itemStyle: {
            borderRadius: [0, 6, 6, 0],
            color: (params: any) => {
              const colors = ['#f87171', '#34d399', '#22d3ee', '#7cc4ff'];
              return colors[params.dataIndex];
            },
          },
          label: {
            show: true,
            formatter: (params: any) => {
              const colors = ['Failed', 'Passed', 'Assessment Taken', 'Over All Learners'];
              return colors[params.dataIndex];
            },
            fontWeight: 600,
          },
        },
      ],
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
