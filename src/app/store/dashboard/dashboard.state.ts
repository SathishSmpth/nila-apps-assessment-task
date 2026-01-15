import { createReducer, on } from '@ngrx/store';
import { DashboardModel } from '../../model';
import * as DashboardActions from './dashboard.actions';
import { DashboardState } from './dashboard.model';

const initialState: DashboardState = {
  year: '2024',
  monthlyOrYearly: 'Monthly',
  districts: 'All Districts',
  theme: 'light',
};

export const dashboardReducer = createReducer(
  initialState,
  on(DashboardActions.setYear, (state, action) => ({
    ...state,
    year: action.year,
  })),
  on(DashboardActions.toggleTheme, (state) => ({
    ...state,
    theme: state.theme === 'light' ? 'dark' : 'light',
  })),
  on(DashboardActions.setTheme, (state, action) => ({
    ...state,
    theme: action.theme,
  }))
);
