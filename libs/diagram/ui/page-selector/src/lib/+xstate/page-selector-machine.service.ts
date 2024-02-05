import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, filter, from, map, Observable } from 'rxjs';
import { createMachine, interpret, MachineOptions } from 'xstate';
import { PagePositionIndicatorRef } from '../components/page-position-indicator/page-position-indicator-ref';
import {
  INDICATOR_X_OFFSET,
  INDICATOR_Y_OFFSET,
} from '../components/page-position-indicator/page-position-indicator.config';
import { PagePositionIndicatorService } from '../components/page-position-indicator/page-position-indicator.service';
import { MoveResult, ScrollData, TfxPoint } from '../page-selector.types';
import {
  pagesChangeAction,
  selectedPageChangedAction,
  tabViewerOverflowChangedAction,
  tabViewerScrollAction,
} from './page-selector.actions';
import { pageSelectorConfig, pageSelectorContext } from './page-selector.config';
import {
  MoveCancelEvent,
  MoveStartDelayEvent,
  PagesChangeEvent,
  PageSelectorEvents,
  SelectedPageChangeEvent,
  TabViewerOverflowChangeEvent,
  TabViewerScrollEvent,
} from './page-selector.events';
import {
  multiplePagesGuard,
  noTabViewerOverflowGuard,
  singlePageGuard,
  tabViewerNotScrolledGuard,
  tabViewerOverflowGuard,
  tabViewerScrolledGuard,
} from './page-selector.guards';
import { IStateMachineService, PageSelectorContext } from './page-selector.schema';

@Injectable()
export class PageSelectorMachineService implements IStateMachineService {
  private insertPoints: TfxPoint[] = [];
  private insertPointsSubject = new BehaviorSubject<TfxPoint[]>(this.insertPoints);
  insertPoints$ = this.insertPointsSubject.asObservable();

  private indicatorRef: PagePositionIndicatorRef | null = null;

  pageSelectorMachineOptions: Partial<MachineOptions<PageSelectorContext, PageSelectorEvents>> =
    {
      actions: {
        pagesChangeAction,
        selectedPageChangedAction,
        tabViewerOverflowChangedAction,
        tabViewerScrollAction,
      },
      guards: {
        singlePageGuard,
        multiplePagesGuard,
        noTabViewerOverflowGuard,
        tabViewerOverflowGuard,
        tabViewerNotScrolledGuard,
        tabViewerScrolledGuard,
      },
    };

  private pageSelectorMachine = createMachine<PageSelectorContext, PageSelectorEvents>(
    pageSelectorConfig()
  )
    .withConfig(this.pageSelectorMachineOptions)
    .withContext({
      ...pageSelectorContext,
      stateMachineService: this as IStateMachineService,
    });
  private service = interpret(this.pageSelectorMachine).start();

  state$ = from(this.service);
  trackingState$: Observable<boolean> = this.state$.pipe(
    map((state) => state.matches('moving.tracking')),
    distinctUntilChanged()
  );
  scrollData$: Observable<ScrollData> = this.state$.pipe(
    map((state) => {
      return {
        leftDisabled: !state.matches('viewing.multiplePages.leftTabViewSide.clipped'),
        rightDisabled: !state.matches('viewing.multiplePages.rightTabViewSide.clipped'),
        scrollIndex: state.context.scrollIndex,
      };
    })
  );
  moveResult$: Observable<MoveResult> = this.state$.pipe(
    filter((state) => {
      if (state.event.type !== 'MOVE_COMPLETE_EVENT') {
        return false;
      }
      const insertIndex = state.context.insertPointIndex + state.context.scrollIndex;
      const selectedPageIndex = state.context.selectedPageIndex;
      if (insertIndex === selectedPageIndex || insertIndex === selectedPageIndex + 1) {
        return false;
      }
      return true;
    }),
    map((state) => {
      const currentPageIndex = state.context.selectedPageIndex;
      const insertIndex = state.context.insertPointIndex + state.context.scrollIndex;
      const newPageIndex = insertIndex < currentPageIndex ? insertIndex : insertIndex - 1;
      return {
        currentPageIndex,
        newPageIndex: newPageIndex,
      } as MoveResult;
    })
  );

  constructor(private indicatorService: PagePositionIndicatorService) {}

  send(event: PageSelectorEvents) {
    this.service.send(event);
  }

  stop() {
    this.service.stop();
  }

  // IStateMachineService Methods
  // --------------------------------------------------------------------------

  public showIndicator(indicatorPosition: TfxPoint) {
    if (this.indicatorRef) {
      this.indicatorRef.updatePosition({
        left: `${indicatorPosition.x - INDICATOR_X_OFFSET}px`,
        top: `${indicatorPosition.y - INDICATOR_Y_OFFSET}px`,
      });
    } else {
      this.indicatorRef = this.indicatorService.open({
        position: {
          left: `${indicatorPosition.x - INDICATOR_X_OFFSET}px`,
          top: `${indicatorPosition.y - INDICATOR_Y_OFFSET}px`,
        },
      });
    }
  }

  public hideIndicator() {
    if (this.indicatorRef) {
      this.indicatorRef.close();
      this.indicatorRef = null;
    }
  }

  // --------------------------------------------------------------------------

  public tabInsertPointsChanged(insertPoints: TfxPoint[]) {
    this.insertPoints = insertPoints;
    this.insertPointsSubject.next(this.insertPoints);
  }

  // Event helper functions
  // --------------------------------------------------------------------------

  public tabViewerOverflowChanged(overflow: boolean) {
    this.service.send(new TabViewerOverflowChangeEvent(overflow));
  }

  // public sendTabViewerInsertPointsChanged(insertPoints: TfxPoint[]) {
  //   this.service.send('x.tabViewer.insertPointsChanged', { insertPoints });
  // }

  public pagesChanged(pages: string[]) {
    this.service.send(new PagesChangeEvent(pages));
  }

  public selectedPageChanged(selectedPageIndex: number) {
    this.service.send(new SelectedPageChangeEvent(selectedPageIndex));
  }

  public sendTabViewerScroll(scrollIndexDelta: number) {
    this.service.send(new TabViewerScrollEvent(scrollIndexDelta));
  }

  // public tabViewerScrollLeft() {}

  // public tabViewerScrollRight() {}

  public moveStartDelay() {
    this.service.send(new MoveStartDelayEvent());
  }

  public moveCancel() {
    this.service.send(new MoveCancelEvent());
  }
}
