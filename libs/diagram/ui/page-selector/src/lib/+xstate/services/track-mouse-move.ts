import { combineLatest, fromEvent, map, mapTo, merge } from 'rxjs';
import { TfxPoint } from '../../page-selector.types';
import {
  MoveCompleteEvent,
  MoveMouseMoveEvent,
  MoveScrollLeftEvent,
  MoveScrollRightEvent,
} from '../page-selector.events';
import { IStateMachineService, PageSelectorContext } from '../page-selector.schema';
import { mousemove$ } from './mousemove.observable';

const finished$ = fromEvent(document, 'mouseup').pipe(mapTo('finished'));

export const trackMouseMove = (context: PageSelectorContext) => {
  return merge(
    combineLatest([
      mousemove$.pipe(map((mouseEvent: MouseEvent) => mouseEvent.clientX)),
      (context.stateMachineService as IStateMachineService).insertPoints$,
    ]),
    finished$
  ).pipe(
    map((v: [number, TfxPoint[]] | string) => {
      if (v === 'finished') {
        return new MoveCompleteEvent();
      } else {
        const mouseX = v[0] as number;
        const insertPoints = v[1] as TfxPoint[];
        if (mouseX < insertPoints[0].x) {
          return new MoveScrollLeftEvent();
        }
        if (mouseX >= insertPoints[insertPoints.length - 1].x) {
          return new MoveScrollRightEvent();
        }
        return new MoveMouseMoveEvent(0);
      }
    })
  );
};
