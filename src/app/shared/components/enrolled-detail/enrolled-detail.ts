import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { DashboardService } from '../../../services/dashboard.service';
import { Store } from '@ngrx/store';
import { selectDistrict, selectYear } from '../../../store';
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
    combineLatest([this.store.select(selectYear), this.store.select(selectDistrict)])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([year, district]) => {
        this.getEnrolledDetails(year, district);
      });
  }

  getEnrolledDetails(year: string, district: string) {
    this.dashboardService
      .getEnrolledDetails(year, district)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.enrolledDetails.set(data);
      });
  }

  ngOnDestroy(): void {}
}
