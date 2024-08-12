import { Injectable, OnDestroy, inject } from '@angular/core';
import { Subscription, map, switchMap, take, takeUntil, timer } from 'rxjs';
import { PageTabClickData, TfxPoint } from '../../../page-selector.types';
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

  private indicatorRef: PagePositionIndicatorRef | null = null;

  // An observer that emits if the user keeps the left mouse button
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

  // An observer that emits a MouseEvent every time the mouse is moved
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

  private leftAutoScroller = new AutoScroller();
  private rightAutoScroller = new AutoScroller();

  private subscriptions = new Subscription();

  constructor() {
    this.subscriptions.add(this.dragStartSubscribe());
    this.subscriptions.add(this.dragMoveSubscribe());
    this.subscriptions.add(this.dragEndSubscribe());
    this.subscriptions.add(
      this.leftAutoScroller.doAutoScroll$.subscribe(() => {
        this.viewerService.scrollLeft();
        if (!this.viewerService.pageTabsViewerVM().overflowed) {
          this.leftAutoScroller.stopAutoScroll();
        }
      })
    );
    this.subscriptions.add(
      this.rightAutoScroller.doAutoScroll$.subscribe(() => {
        this.viewerService.scrollRight();
        if (!this.viewerService.pageTabsViewerVM().scrolled) {
          this.rightAutoScroller.stopAutoScroll();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private dragStartSubscribe(): Subscription {
    return this.dragStart$.subscribe((clickData: PageTabClickData) => {
      const { pageIndex: i } = clickData;
      const tabs = this.viewerService.pageTabs;
      if (tabs.length > 1 && tabs[i]) {
        const { left: x, refY: y } = tabs[i];
        this.showIndicator({ x, y });
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
          // TODO: insertIdx = firstVisibleIdx
        } else if (
          idx === lastVisibleIdx &&
          tabs[idx].visibilityStatus === 'partially-visible'
        ) {
          this.viewerService.scrollLeft();
          const tab = this.viewerService.pageTabs[idx];
          indicatorPosition = { x: tab.left, y: tab.refY };
          // TODO: insertIdx = lastVisibleIdx
        } else if (idx >= 0) {
          indicatorPosition = { x: tabs[idx].left, y: tabs[idx].refY };
          // TODO: insertIdx = idx;
        } else if (mouseX > limitX) {
          indicatorPosition = { x: limitX + 1, y: tabs[0].refY };
          if (overflowed) {
            this.leftAutoScroller.autoScroll();
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
      console.log(clickData.pageIndex);
      this.hideIndicator();
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
