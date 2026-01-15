import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { DashboardService } from '../../../services/dashboard.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective } from 'ngx-echarts';
import { PassStatsModel } from '../../../model';
import { selectDistrict, selectTheme, selectYear } from '../../../store';
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
  theme: WritableSignal<string> = signal('light');
  option: WritableSignal<any> = signal(null);

  ngOnInit(): void {
    combineLatest([
      this.store.select(selectYear),
      this.store.select(selectDistrict),
      this.store.select(selectTheme),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([year, district, theme]) => {
        this.theme.set(theme);
        this.getPassStats(year, district);
        const data = this.passStatsDetail();
        if (data) {
          this.buildChartOption(data, theme);
        }
      });
  }

  getPassStats(year: string, district: string) {
    this.dashboardService
      .getPassStats(year, district)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.passStatsDetail.set(data);
        if (data) {
          this.buildChartOption(data, this.theme());
        }
      });
  }

  buildChartOption(data: PassStatsModel, theme: string) {
    const isDark = theme === 'dark';

    const option = {
      animationDuration: 800,
      animationEasing: 'cubicOut',
      backgroundColor: isDark ? '#031427' : '#f8f9ff',
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

    this.option.set(option);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
