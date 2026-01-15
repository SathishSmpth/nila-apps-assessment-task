import { createAction, props } from '@ngrx/store';

export const setYear = createAction('[Header] Set Year', props<{ year: string }>());

export const toggleTheme = createAction('[Header] Toggle Theme');

export const setTheme = createAction('[Header] Set Theme', props<{ theme: 'light' | 'dark' }>());
