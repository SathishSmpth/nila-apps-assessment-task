import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { DashboardService } from '../../../services/dashboard.service';
import { Subject, takeUntil } from 'rxjs';
import { CourseProgressModel } from '../../../model';
import { NgxEchartsDirective } from 'ngx-echarts';
import { Store } from '@ngrx/store';
import { selectTheme, selectYear } from '../../../store';

@Component({
  selector: 'app-course-progress-rate',
  imports: [CommonModule, MatCardModule, NgxEchartsDirective],
  templateUrl: './course-progress-rate.html',
  styleUrl: './course-progress-rate.scss',
})
export class CourseProgressRate implements OnInit {
  private readonly destroy$ = new Subject<void>();

  private dashboardService = inject(DashboardService);
  private store = inject(Store);
  courseProgressDetail: WritableSignal<CourseProgressModel[] | null> = signal(null);
  theme: WritableSignal<string> = signal('light');
  option: WritableSignal<any> = signal(null);

  ngOnInit(): void {
    this.store
      .select(selectYear)
      .pipe(takeUntil(this.destroy$))
      .subscribe((year) => {
        this.getProgressRate(year);
      });

    this.store
      .select(selectTheme)
      .pipe(takeUntil(this.destroy$))
      .subscribe((theme) => {
        this.theme.set(theme);
        const data = this.courseProgressDetail();
        if (data) {
          this.buildChartOption(data, theme);
        }
      });
  }

  getProgressRate(year: string) {
    this.dashboardService
      .getCourseProgress(year)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.courseProgressDetail.set(data);
        if (data) {
          this.buildChartOption(data, this.theme());
        }
      });
  }

  buildChartOption(data: CourseProgressModel[], theme: string) {
    const isDark = theme == 'dark';

    const option = {
      animationDuration: 800,
      animationEasing: 'cubicOut',
      backgroundColor: isDark ? '#000' : '#fff',
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
      },
      legend: {
        top: 0,
        left: 'right',
        itemWidth: 12,
        itemHeight: 12,
        icon: 'circle',
        textStyle: {
          color: isDark ? '#e5e7eb' : '#374151',
        },
      },
      grid: {
        top: 50,
        left: '3%',
        right: '4%',
        bottom: '8%',
      },
      xAxis: {
        type: 'category',
        name: 'Districts',
        nameLocation: 'middle',
        nameTextStyle: {
          color: isDark ? '#d1d5db' : '#374151',
          fontSize: 13,
          fontWeight: 600,
        },
        data: data?.map((d) => d.district),
        axisLabel: {
          rotate: 30,
          color: isDark ? '#d1d5db' : '#374151',
        },
        axisLine: {
          lineStyle: {
            color: isDark ? '#4b5563' : '#e5e7eb',
          },
        },
      },
      yAxis: {
        type: 'value',
        max: 100,
        name: 'Course Progress %',
        nameLocation: 'middle',
        nameRotate: 90,
        nameGap: 50,
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
          name: 'Below',
          type: 'bar',
          barWidth: '25%',
          data: data?.map((d) => d.below),
          itemStyle: { color: '#f87171' },
        },
        {
          name: 'Average',
          type: 'bar',
          barWidth: '25%',
          data: data?.map((d) => d.average),
          itemStyle: { color: '#34d399' },
        },
        {
          name: 'Good',
          type: 'bar',
          barWidth: '25%',
          data: data?.map((d) => d.good),
          itemStyle: { color: '#60a5fa' },
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
