import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';

import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DashboardService } from '../../../services/dashboard.service';
import { startWith, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { setYear, toggleTheme } from '../../../store';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatButtonToggleModule,
    MatCardModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  readonly destroy$ = new Subject<void>();

  minDate = new Date(2024, 0, 1);
  maxDate = new Date(2025, 11, 31);

  startAt = new Date(2024, 0, 1);

  private dashboardService = inject(DashboardService);
  private store = inject(Store);

  districtsOptions: WritableSignal<any[]> = signal([]);

  filterForm!: FormGroup;

  startYear = '2024';
  endYear = '2025';

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.filterForm = new FormGroup({
      monthOrYear: new FormControl('monthly'),
      year: new FormGroup({
        startYear: new FormControl(new Date(2024, 0, 1)),
        endYear: new FormControl(new Date(2024, 11, 31)),
      }),
      district: new FormControl('All District'),
    });

    const year$ = this.filterForm.get('year');

    if (year$) {
      year$.valueChanges
        .pipe(startWith(year$.value), takeUntil(this.destroy$))
        .subscribe((value) => {
          const startYear = new Date(value?.startYear).getUTCFullYear();
          const endYear = new Date(value?.endYear).getUTCFullYear();
          if (startYear && endYear) {
            this.store.dispatch(setYear({ year: endYear.toString() }));
            this.getDistricts(endYear.toString());
          }
        });
    }
  }

  yearSelected(normalizedYear: Date, picker: any) {
    const year = normalizedYear.getFullYear();

    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);

    this.filterForm.get('year.startYear')?.setValue(start);
    this.filterForm.get('year.endYear')?.setValue(end);

    picker.close();
  }

  getDistricts(year: string) {
    this.dashboardService
      .getDistricts(year)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.districtsOptions.set([...data, 'All District']);
      });
  }

  toggle() {
    this.store.dispatch(toggleTheme());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
