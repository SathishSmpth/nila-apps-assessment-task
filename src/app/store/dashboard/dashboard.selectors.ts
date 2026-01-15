import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DashboardState } from './dashboard.model';

export const selectDashboardState = createFeatureSelector<DashboardState>('dashboard');

export const selectYear = createSelector(selectDashboardState, (state) => state.year);

export const selectTheme = createSelector(selectDashboardState, (state) => state.theme);
