import { Injectable, OnDestroy, inject, signal } from '@angular/core';
import { Subject, Subscription, map, switchMap, take, takeUntil, timer } from 'rxjs';
import { MoveResult, PageTabClickData, TfxPoint } from '../../../page-selector.types';
import { PagePositionIndicatorRef } from '../../page-position-indicator/page-position-indicator-ref';
import {
  INDICATOR_X_OFFSET,
  INDICATOR_Y_OFFSET,
  IndicatorPosition,
} from '../../page-position-indicator/page-position-indicator.config';
import { PagePositionIndicatorService } from '../../page-position-indicator/page-position-indicator.service';
import { AutoScroller } from './auto-scroller';
import { leftMouseDownOnTab$, leftMouseUp$, mouseMove$ } from './mouse-observables';
import { PageTabsViewerService } from './page-tabs-viewer.service';

@Injectable()
export class DragTabService implements OnDestroy {
  // Injected services
  private indicatorService = inject(PagePositionIndicatorService);
  private viewerService = inject(PageTabsViewerService);

  private pageMoveSubject$ = new Subject<MoveResult>();
  public pageMove$ = this.pageMoveSubject$.asObservable();

  public dragInProgress = signal(false);

  private indicatorRef: PagePositionIndicatorRef | null = null;

  // An observable that emits if the user keeps the left mouse button
  // down for half a second after depressing the button on a page
  // tab
  private dragStart$ = leftMouseDownOnTab$.pipe(
    switchMap((ev: PageTabClickData) =>
      timer(500).pipe(
        takeUntil(leftMouseUp$),
        map(() => ev)
      )
    )
  );

  // An observable that emits a MouseEvent every time the mouse is moved
  // after the user has held the mouse left button down for half a second
  // after a click on a page tab until the left mouse button is raised
  private dragMove$ = this.dragStart$.pipe(
    switchMap(() => mouseMove$.pipe(takeUntil(leftMouseUp$)))
  );

  // An observable that emits a MouseEvent when the user raises the left
  // mouse button after the user has held the mouse left button down for half
  // a second after a click on a page tab.
  private dragEnd$ = this.dragStart$.pipe(
    switchMap((ev: PageTabClickData) =>
      leftMouseUp$.pipe(
        take(1),
        map(() => ev)
      )
    )
  );

  private leftAutoScroller = new AutoScroller('left');
  private rightAutoScroller = new AutoScroller('right');

  private indicatorIdx = -1;

  private subscriptions = new Subscription();

  constructor() {
    this.subscriptions.add(this.dragStartSubscribe());
    this.subscriptions.add(this.dragMoveSubscribe());
    this.subscriptions.add(this.dragEndSubscribe());
    this.subscriptions.add(this.doRightAutoScroll());
    this.subscriptions.add(this.doLeftAutoScroll());
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private dragStartSubscribe(): Subscription {
    return this.dragStart$.subscribe((clickData: PageTabClickData) => {
      const { pageIndex: i } = clickData;
      let tabs = this.viewerService.pageTabs;
      if (tabs.length > 1 && tabs[i]) {
        if (tabs[i].left < tabs[0].refX) {
          // tab is partially visible on left of viewer so scroll
          // right to bring it fully into view
          this.viewerService.scrollRight();
          tabs = this.viewerService.pageTabs;
        }
        const { left: x, refY: y } = tabs[i];
        this.indicatorIdx = i;
        this.showIndicator({ x, y });
        this.dragInProgress.set(true);
      }
    });
  }

  private dragMoveSubscribe(): Subscription {
    return this.dragMove$.subscribe((ev: MouseEvent) => {
      const tabs = this.viewerService.pageTabs;
      if (this.indicatorRef && tabs.length > 1) {
        const { clientX: mouseX } = ev;
        const { firstVisibleIdx, lastVisibleIdx, scrolled, overflowed } =
          this.viewerService.pageTabsViewerVM();

        const lastIdx = tabs.length - 1;
        const baseX = tabs[0].refX;
        const limitX =
          tabs[lastIdx].visibilityStatus === 'visible'
            ? tabs[lastIdx].left + tabs[lastIdx].width - 1
            : baseX + this.viewerService.maxWidth;
        let idx = -1;
        for (let i = firstVisibleIdx; i <= lastVisibleIdx; i++) {
          if (
            mouseX >= Math.max(tabs[i].left, baseX) &&
            mouseX <= Math.min(tabs[i].left + tabs[i].width - 1, limitX)
          ) {
            idx = i;
            this.leftAutoScroller.stopAutoScroll();
            this.rightAutoScroller.stopAutoScroll();
            break;
          }
        }

        let indicatorPosition: TfxPoint = { x: -100, y: -100 };
        if (idx === firstVisibleIdx && tabs[idx].visibilityStatus === 'partially-visible') {
          this.viewerService.scrollRight();
          indicatorPosition = { x: baseX, y: tabs[0].refY };
          this.indicatorIdx = firstVisibleIdx;
        } else if (
          idx === lastVisibleIdx &&
          tabs[idx].visibilityStatus === 'partially-visible'
        ) {
          this.viewerService.scrollLeft();
          const tab = this.viewerService.pageTabs[idx];
          indicatorPosition = { x: tab.left, y: tab.refY };
          this.indicatorIdx = lastVisibleIdx;
        } else if (idx >= 0) {
          indicatorPosition = { x: tabs[idx].left, y: tabs[idx].refY };
          this.indicatorIdx = idx;
        } else if (mouseX > limitX) {
          if (overflowed || this.leftAutoScroller.running) {
            const tab = this.viewerService.pageTabs[lastVisibleIdx];
            indicatorPosition = { x: tab.left, y: tab.refY };
            this.indicatorIdx = lastVisibleIdx;
            this.leftAutoScroller.autoScroll();
          } else {
            indicatorPosition = { x: limitX, y: tabs[0].refY };
            this.indicatorIdx = tabs.length;
          }
        } else if (mouseX < baseX) {
          indicatorPosition = { x: baseX, y: tabs[0].refY };
          if (scrolled) {
            this.rightAutoScroller.autoScroll();
          }
        }

        this.indicatorRef.updatePosition(
          this.convertPointToIndicatorPosition(indicatorPosition)
        );
      }
    });
  }

  private dragEndSubscribe(): Subscription {
    return this.dragEnd$.subscribe((clickData) => {
      this.leftAutoScroller.stopAutoScroll();
      this.rightAutoScroller.stopAutoScroll();
      this.hideIndicator();
      const newPageIndex =
        this.indicatorIdx <= clickData.pageIndex ? this.indicatorIdx : this.indicatorIdx - 1;
      if (newPageIndex !== clickData.pageIndex) {
        this.pageMoveSubject$.next({
          newPageIndex,
          currentPageIndex: clickData.pageIndex,
        });
      }
      this.dragInProgress.set(false);
    });
  }

  private doLeftAutoScroll(): Subscription {
    return this.leftAutoScroller.doAutoScroll$.subscribe(() => {
      const { overflowed: overflowedBeforeScroll } = this.viewerService.pageTabsViewerVM();
      this.viewerService.scrollLeft();
      const { lastVisibleIdx } = this.viewerService.pageTabsViewerVM();
      const tabs = this.viewerService.pageTabs;
      let indicatorPosition = { x: tabs[lastVisibleIdx].left, y: tabs[0].refY };
      if (!overflowedBeforeScroll) {
        if (tabs.length > 1) {
          const maxWidth = this.viewerService.maxWidth;
          this.indicatorIdx = tabs.length;
          const limitX = tabs[0].refX + maxWidth - 1;
          indicatorPosition = { x: limitX, y: tabs[0].refY };
        }
        this.leftAutoScroller.stopAutoScroll();
      } else {
        this.indicatorIdx = lastVisibleIdx;
      }
      if (this.indicatorRef) {
        this.indicatorRef.updatePosition(
          this.convertPointToIndicatorPosition(indicatorPosition)
        );
      }
    });
  }

  private doRightAutoScroll(): Subscription {
    return this.rightAutoScroller.doAutoScroll$.subscribe(() => {
      this.viewerService.scrollRight();
      const { firstVisibleIdx } = this.viewerService.pageTabsViewerVM();
      this.indicatorIdx = firstVisibleIdx;
      if (!this.viewerService.pageTabsViewerVM().scrolled) {
        this.rightAutoScroller.stopAutoScroll();
      }
    });
  }

  /**
   *
   * @param p - point to convert
   * @returns - IndicatorPosition object for supplied point.
   */
  private convertPointToIndicatorPosition(p: TfxPoint): IndicatorPosition {
    return {
      left: `${p.x - INDICATOR_X_OFFSET}px`,
      top: `${p.y - INDICATOR_Y_OFFSET}px`,
    };
  }

  private showIndicator(indicatorPosition: TfxPoint) {
    if (this.indicatorRef) {
      this.indicatorRef.updatePosition(this.convertPointToIndicatorPosition(indicatorPosition));
    } else {
      this.indicatorRef = this.indicatorService.open({
        position: this.convertPointToIndicatorPosition(indicatorPosition),
      });
    }
  }

  private hideIndicator() {
    if (this.indicatorRef) {
      this.indicatorRef.close();
      this.indicatorRef = null;
    }
  }
}
