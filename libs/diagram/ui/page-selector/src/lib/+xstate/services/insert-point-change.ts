import { combineLatest, distinctUntilChanged, map } from 'rxjs';
import { TfxPoint } from '../../page-selector.types';
import { MoveInsertPointChangeEvent } from '../page-selector.events';
import { IStateMachineService, PageSelectorContext } from '../page-selector.schema';
import { mousemove$ } from './mousemove.observable';

export const insertPointChange = (context: PageSelectorContext) => {
  return combineLatest([
    mousemove$.pipe(map((mouseEvent: MouseEvent) => mouseEvent.clientX)),
    (context.stateMachineService as IStateMachineService).insertPoints$,
  ]).pipe(
    map(([mouseX, insertPoints]) => {
      const { insertPoint, insertPointIndex } = getInsertPoint(mouseX, insertPoints);
      return new MoveInsertPointChangeEvent(insertPoint, insertPointIndex);
    }),
    distinctUntilChanged(
      (p: MoveInsertPointChangeEvent, q: MoveInsertPointChangeEvent) =>
        p.newInsertPoint.x === q.newInsertPoint.x
    )
  );
};

const getInsertPoint = (x: number, insertPoints: TfxPoint[]) => {
  let pos = 0;
  for (let i = insertPoints.length - 1; i >= 0; i--) {
    if (x >= insertPoints[i].x) {
      pos = i;
      break;
    }
  }
  return {
    insertPoint: { x: insertPoints[pos].x, y: insertPoints[pos].y },
    insertPointIndex: pos,
  };
};
