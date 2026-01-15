import { Routes } from '@angular/router';
import { HomePage } from './pages';
import { App } from './app';

export const routes: Routes = [
  { path: '', component: App, children: [{ path: '', component: HomePage }] },
];
