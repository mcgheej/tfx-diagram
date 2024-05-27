import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Actor, createActor } from 'xstate5';
import { PagePositionIndicatorRef } from '../components/page-position-indicator/page-position-indicator-ref';
import {
  INDICATOR_X_OFFSET,
  INDICATOR_Y_OFFSET,
} from '../components/page-position-indicator/page-position-indicator.config';
import { PagePositionIndicatorService } from '../components/page-position-indicator/page-position-indicator.service';
import { TfxPoint } from '../page-selector.types';
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

  private pageSelectorActor: Actor<typeof pageSelectorMachine> | undefined;

  constructor(private indicatorService: PagePositionIndicatorService) {}

  start() {
    if (this.pageSelectorActor) {
      this.stop();
    }

    this.pageSelectorActor = createActor(pageSelectorMachine, {
      input: {
        stateMachineService: this,
      },
    });
    // const state$ = from(this.pageSelectorActor);
    this.pageSelectorActor.start();
  }

  stop() {
    if (this.pageSelectorActor) {
      this.pageSelectorActor.stop();
    }
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
}
