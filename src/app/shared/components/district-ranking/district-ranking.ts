import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { combineLatest, Subject, take, takeUntil } from 'rxjs';
import { DashboardService } from '../../../services/dashboard.service';
import { Store } from '@ngrx/store';
import { selectDistrict, selectTheme, selectYear } from '../../../store';
import { DistrictRankingModel } from '../../../model';
import { MatCardModule } from '@angular/material/card';
import { NgxEchartsDirective } from 'ngx-echarts';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-district-ranking',
  imports: [
    MatCardModule,
    NgxEchartsDirective,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './district-ranking.html',
  styleUrl: './district-ranking.scss',
})
export class DistrictRanking implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  formControl = new FormControl('Rank By Enrollment');

  private dashboardService = inject(DashboardService);
  private store = inject(Store);
  districtRanking: WritableSignal<DistrictRankingModel | null> = signal(null);
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
        this.getDistrictRanking(year, district);
        const data = this.districtRanking();
        if (data) {
          this.buildChartOption(data, theme);
        }
      });

    this.formControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      const data = this.districtRanking();
      if (value && data) {
        this.buildChartOption(data, this.theme());
      }
    });
  }

  getDistrictRanking(year: string, district: string) {
    this.dashboardService
      .getDistrictRanking(year, district)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.districtRanking.set(data);
        if (data) {
          this.buildChartOption(data, this.theme());
        }
      });
  }

  buildChartOption(data: DistrictRankingModel, theme: string) {
    const isDark = theme == 'dark';
    const rankBy = this.formControl.value;

    const sortedDistricts = [...data.districts].sort((a, b) => {
      if (rankBy === 'Rank By Pass %') {
        const passA = (a.passed / a.enrolled) * 100;
        const passB = (b.passed / b.enrolled) * 100;
        return passB - passA;
      }

      return b.enrolled - a.enrolled;
    });

    const districtRankingOption = {
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
        left: '2%',
        right: '2%',
        bottom: '8%',
      },
      xAxis: {
        name: 'Districts',
        nameLocation: 'middle',
        nameTextStyle: {
          color: isDark ? '#d1d5db' : '#374151',
          fontSize: 13,
          fontWeight: 600,
        },
        data: sortedDistricts.map((d) => `${d.district}\n Rank-${d.rank}`),
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
      yAxis: [
        {
          type: 'value',
          name: 'Number of Users',
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
        {
          type: 'value',
          max: 100,
          name: 'Pass / Completion %',
          nameLocation: 'middle',
          nameRotate: 90,
          nameGap: 50,
          nameTextStyle: {
            color: isDark ? '#d1d5db' : '#374151',
            fontSize: 13,
            fontWeight: 600,
          },
          axisLabel: {
            formatter: '{value}%',
            color: isDark ? '#d1d5db' : '#374151',
          },
          splitLine: {
            lineStyle: {
              color: isDark ? '#374151' : '#f3f4f6',
            },
          },
        },
      ],
      series: [
        {
          name: 'Male',
          type: 'bar',
          stack: 'enrollment',
          data: sortedDistricts.map((d) => d.male),
          barWidth: 25,
        },
        {
          name: 'Female',
          type: 'bar',
          stack: 'enrollment',
          data: sortedDistricts.map((d) => d.female),
          barWidth: 25,
        },
        {
          name: 'Others',
          type: 'bar',
          stack: 'enrollment',
          data: sortedDistricts.map((d) => d.others),
          barWidth: 25,
        },
        {
          name: 'Passed',
          type: 'bar',
          yAxisIndex: 1,
          data: sortedDistricts.map((d) => Math.round((d.passed / d.enrolled) * 100)),
          barWidth: 25,
        },
        {
          name: 'Assessment Completed',
          type: 'bar',
          yAxisIndex: 1,
          data: sortedDistricts.map((d) => Math.round((d.assessmentCompleted / d.enrolled) * 100)),
          barWidth: 25,
        },
      ],
    };

    this.option.set(districtRankingOption);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
