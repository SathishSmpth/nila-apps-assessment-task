import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { selectTheme, setTheme } from './store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet/>',
})
export class App implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  protected readonly title = signal('nila-ins-lrn-anly');

  private store = inject(Store);

  ngOnInit(): void {
    // Initialize theme from persisted value or OS preference.
    const persisted = (localStorage.getItem('theme') as 'light' | 'dark' | null) ?? null;
    const preferred: 'light' | 'dark' =
      persisted ??
      (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    this.store.dispatch(setTheme({ theme: preferred }));

    this.store
      .select(selectTheme)
      .pipe(takeUntil(this.destroy$))
      .subscribe((theme) => {
        localStorage.setItem('theme', theme);
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
