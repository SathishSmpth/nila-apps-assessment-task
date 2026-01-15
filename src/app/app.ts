import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { selectTheme } from './store';

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
    this.store
      .select(selectTheme)
      .pipe(takeUntil(this.destroy$))
      .subscribe((theme) => {
        document.body.classList.remove('light', 'dark');
        document.body.classList.add(theme);
      });
  }

  ngOnDestroy(): void {}
}
