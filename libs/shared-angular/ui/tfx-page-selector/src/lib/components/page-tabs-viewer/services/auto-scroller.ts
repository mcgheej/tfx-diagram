import { Subject, interval, merge, switchMap, takeUntil } from 'rxjs';
import { leftMouseUp$ } from './mouse-observables';

export class AutoScroller {
  private autoScrolling = false;

  private startAutoScroll$ = new Subject<void>();
  private stopAutoScroll$ = new Subject<void>();

  doAutoScroll$ = this.startAutoScroll$.pipe(
    switchMap(() => interval(1000).pipe(takeUntil(merge(leftMouseUp$, this.stopAutoScroll$))))
  );

  autoScroll() {
    if (!this.autoScrolling) {
      this.startAutoScroll$.next();
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
