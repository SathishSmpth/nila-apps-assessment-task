import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideEchartsCore } from 'ngx-echarts';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { dashboardReducer } from './store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideEchartsCore({
      echarts: () => import('echarts'),
    }),
    provideNativeDateAdapter(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideStore({ dashboard: dashboardReducer }),
  ],
};
