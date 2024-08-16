import { Subject, interval, merge, switchMap, takeUntil } from 'rxjs';
import { leftMouseUp$ } from './mouse-observables';

export class AutoScroller {
  private autoScrolling = false;

  private startAutoScroll$ = new Subject<void>();
  private stopAutoScroll$ = new Subject<void>();
  private initialAutoScroll$ = new Subject<void>();

  constructor(public name = 'anonymous') {}

  get stopped(): boolean {
    return !this.autoScrolling;
  }

  get running(): boolean {
    return this.autoScrolling;
  }

  doAutoScroll$ = merge(
    this.initialAutoScroll$,
    this.startAutoScroll$.pipe(
      switchMap(() => interval(1000).pipe(takeUntil(merge(leftMouseUp$, this.stopAutoScroll$))))
    )
  );

  autoScroll() {
    if (!this.autoScrolling) {
      this.startAutoScroll$.next();
      this.initialAutoScroll$.next();
      this.autoScrolling = true;
    }
  }

  stopAutoScroll() {
    if (this.autoScrolling) {
      this.stopAutoScroll$.next();
      this.autoScrolling = false;
    }
  }
}
