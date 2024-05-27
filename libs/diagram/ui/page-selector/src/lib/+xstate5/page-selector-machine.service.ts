import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, distinctUntilChanged, filter, from, map } from 'rxjs';
import { Actor, createActor } from 'xstate5';
import { PagePositionIndicatorRef } from '../components/page-position-indicator/page-position-indicator-ref';
import {
  INDICATOR_X_OFFSET,
  INDICATOR_Y_OFFSET,
} from '../components/page-position-indicator/page-position-indicator.config';
import { PagePositionIndicatorService } from '../components/page-position-indicator/page-position-indicator.service';
import { MoveResult, ScrollData, TfxPoint } from '../page-selector.types';
import { PageSelectorEvents } from './page-selector.events';
import { pageSelectorMachine } from './page-selector.machine';

export interface IStateMachineService {
  insertPoints$: Observable<TfxPoint[]>;
  showIndicator(indicatorPosition: TfxPoint): void;
  hideIndicator(): void;
}

@Injectable()
export class PageSelectorMachineService implements IStateMachineService {
  private insertPoints: TfxPoint[] = [];
  private insertPointsSubject = new BehaviorSubject<TfxPoint[]>(this.insertPoints);
  insertPoints$ = this.insertPointsSubject.asObservable();

  private indicatorRef: PagePositionIndicatorRef | null = null;

  private pageSelectorActor: Actor<typeof pageSelectorMachine> = createActor(
    pageSelectorMachine,
    {
      input: {
        stateMachineService: this,
      },
    }
  );

  private stateSnapshot$ = from(this.pageSelectorActor);
  trackingState$: Observable<boolean> = this.stateSnapshot$.pipe(
    map((snapshot) => snapshot.matches({ moving: 'tracking' })),
    distinctUntilChanged()
  );
  scrollData$: Observable<ScrollData> = this.stateSnapshot$.pipe(
    map((state) => {
      console.log(state.value);
      return {
        leftDisabled: !state.matches({
          viewing: { multiplePages: { leftTabViewSide: 'clipped' } },
        }),
        rightDisabled: !state.matches({
          viewing: { multiplePages: { rightTabViewSide: 'clipped' } },
        }),
        scrollIndex: state.context.scrollIndex,
      };
    })
  );
  moveResult$: Observable<MoveResult> = this.stateSnapshot$.pipe(
    filter((snapshot) => {
      if (!snapshot.matches({ moving: 'doMove' })) {
        return false;
      }
      const context = snapshot.context;
      const insertIndex = context.insertPointIndex + context.scrollIndex;
      const selectedPageIndex = context.selectedPageIndex;
      if (insertIndex === selectedPageIndex || insertIndex === selectedPageIndex + 1) {
        return false;
      }
      return true;
    }),
    map(({ context }) => {
      const currentPageIndex = context.selectedPageIndex;
      const insertIndex = context.insertPointIndex + context.scrollIndex;
      const newPageIndex = insertIndex < currentPageIndex ? insertIndex : insertIndex - 1;
      return {
        currentPageIndex,
        newPageIndex: newPageIndex,
      } as MoveResult;
    })
  );

  constructor(private indicatorService: PagePositionIndicatorService) {}

  start() {
    this.pageSelectorActor.start();
  }

  stop() {
    this.pageSelectorActor.stop();
  }

  send(event: PageSelectorEvents) {
    this.pageSelectorActor.send(event);
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
    this.pageSelectorActor.send({ type: 'tabViewer.overflowChange', overflow });
  }

  public pagesChanged(pages: string[]) {
    this.pageSelectorActor.send({ type: 'page.pagesChange', pages });
  }

  public selectedPageChanged(selectedPageIndex: number) {
    this.pageSelectorActor.send({ type: 'page.selectedPageChange', selectedPageIndex });
  }

  public sendTabViewerScroll(scrollIndexDelta: number) {
    this.pageSelectorActor.send({ type: 'tabViewer.scroll', scrollIndexDelta });
  }

  public moveStartDelay() {
    // this.service.send(new MoveStartDelayEvent());
    this.pageSelectorActor.send({ type: 'move.startDelay' });
  }

  public moveCancel() {
    // this.service.send(new MoveCancelEvent());
    this.pageSelectorActor.send({ type: 'move.cancel' });
  }
}
