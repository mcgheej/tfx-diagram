import { Injectable, OnDestroy, inject } from '@angular/core';
import {
  Subject,
  Subscription,
  filter,
  fromEvent,
  map,
  switchMap,
  take,
  takeUntil,
  timer,
} from 'rxjs';
import { PageTabClickData, TfxPoint } from '../../../page-selector.types';
import { PagePositionIndicatorRef } from '../../page-position-indicator/page-position-indicator-ref';
import { PagePositionIndicatorService } from '../../page-position-indicator/page-position-indicator.service';
import { calcInsertPoint, convertPointToIndicatorPosition } from './helpers';
import { PageTabsViewerService } from './page-tabs-viewer.service';

@Injectable()
export class DragTabService implements OnDestroy {
  // Injected services
  private indicatorService = inject(PagePositionIndicatorService);
  private viewerService = inject(PageTabsViewerService);

  private indicatorRef: PagePositionIndicatorRef | null = null;

  private mouseMove$ = fromEvent<MouseEvent>(document, 'mousemove');
  private leftMouseDown$ = new Subject<PageTabClickData>();
  private leftMouseUp$ = fromEvent<MouseEvent>(document, 'mouseup').pipe(
    filter((ev: MouseEvent) => ev.button === 0)
  );
  private dragStart$ = this.leftMouseDown$.pipe(
    switchMap((ev: PageTabClickData) =>
      timer(500).pipe(
        takeUntil(this.leftMouseUp$),
        map(() => ev)
      )
    )
  );
  private dragMove$ = this.dragStart$.pipe(
    switchMap(() => this.mouseMove$.pipe(takeUntil(this.leftMouseUp$)))
  );
  private dragEnd$ = this.dragStart$.pipe(switchMap(() => this.leftMouseUp$.pipe(take(1))));

  private subscriptions = new Subscription();

  constructor() {
    this.subscriptions.add(this.dragStartSubscribe());
    this.subscriptions.add(this.dragMoveSubscribe());
    this.subscriptions.add(this.dragEndSubscribe());
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  mouseLeftDownOnTab(clickData: PageTabClickData) {
    this.leftMouseDown$.next(clickData);
  }

  private dragStartSubscribe(): Subscription {
    return this.dragStart$.subscribe((clickData: PageTabClickData) => {
      const { pageIndex: i } = clickData;
      const { tabs } = this.viewerService.viewerData;
      if (tabs[i]) {
        const { x, y } = tabs[i];
        this.showIndicator({ x, y });
      }
    });
  }

  private dragMoveSubscribe(): Subscription {
    return this.dragMove$.subscribe((ev: MouseEvent) => {
      if (this.indicatorRef && this.viewerService.viewerData.tabs.length > 1) {
        // const { clientX: x, clientY: y } = ev;
        const { align, startIdx, endIdx } = this.viewerService.pageTabsViewerVM();
        const overflowed = this.viewerService.overflowed();
        const scrolled = this.viewerService.scrolled();
        console.log(
          `align: ${align}, startIdx: ${startIdx}, endIdx: ${endIdx}, overflowed: ${overflowed}, scrolled: ${scrolled}`
        );

        const indicatorPosition = calcInsertPoint(ev.clientX, this.viewerService);
        this.indicatorRef.updatePosition(convertPointToIndicatorPosition(indicatorPosition));
      }
    });
  }

  private dragEndSubscribe(): Subscription {
    return this.dragEnd$.subscribe(() => this.hideIndicator());
  }

  private showIndicator(indicatorPosition: TfxPoint) {
    if (this.indicatorRef) {
      this.indicatorRef.updatePosition(convertPointToIndicatorPosition(indicatorPosition));
    } else {
      this.indicatorRef = this.indicatorService.open({
        position: convertPointToIndicatorPosition(indicatorPosition),
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
