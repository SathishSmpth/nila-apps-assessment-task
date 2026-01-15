import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DashboardService } from '../../../services/dashboard.service';
import { EChartsOption } from 'echarts';
import { GradeBreakdownModel } from '../../../model';
import { MatCardModule } from '@angular/material/card';
import { NgxEchartsDirective } from 'ngx-echarts';
import { selectYear } from '../../../store';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-learner-details',
  imports: [MatCardModule, NgxEchartsDirective],
  templateUrl: './learner-details.html',
  styleUrl: './learner-details.scss',
})
export class LearnerDetails implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  private dashboardService = inject(DashboardService);
  private store = inject(Store);
  gradeBreakDown: WritableSignal<GradeBreakdownModel[] | null> = signal(null);
  option: WritableSignal<EChartsOption | null> = signal(null);

  ngOnInit(): void {
    this.store
      .select(selectYear)
      .pipe(takeUntil(this.destroy$))
      .subscribe((year) => {
        this.getGradeBreakDown(year);
      });
  }

  getGradeBreakDown(year: string) {
    this.dashboardService
      .getGradeBreakDown(year)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.gradeBreakDown.set(data);
        if (data) {
          this.buildChartOption(data);
        }
      });
  }

  buildChartOption(data: GradeBreakdownModel[]) {
    const isDark = false;

    const option: EChartsOption = {
      animationDuration: 800,
      animationEasing: 'cubicOut',
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'middle',
        itemGap: 16,
        formatter: (name: string) => {
          const item = data.find((d) => d.grade === name);
          return item?.label ?? name;
        },
      },
      series: [
        {
          name: 'Learners Details Breakdown',
          type: 'pie',
          radius: '70%',
          data: data.map((item) => ({
            value: item.percent,
            name: item.grade,
            customLabel: item.label,
          })),
          label: {
            show: true,
            formatter: (params: any) => `${params.value}%`,
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
