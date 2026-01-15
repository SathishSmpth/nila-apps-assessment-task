import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DashboardService } from '../../../services/dashboard.service';
import { Store } from '@ngrx/store';
import { selectYear } from '../../../store';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-enrolled-detail',
  imports: [MatCardModule, MatIconModule],
  templateUrl: './enrolled-detail.html',
  styleUrl: './enrolled-detail.scss',
})
export class EnrolledDetail implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  private dashboardService = inject(DashboardService);
  private store = inject(Store);

  enrolledDetails: WritableSignal<any> = signal([]);

  ngOnInit(): void {
    this.store
      .select(selectYear)
      .pipe(takeUntil(this.destroy$))
      .subscribe((year) => {
        this.getEnrolledDetails(year);
      });
  }

  getEnrolledDetails(year: string) {
    this.dashboardService
      .getEnrolledDetails(year)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.enrolledDetails.set(data);
      });
  }

  ngOnDestroy(): void {}
}
