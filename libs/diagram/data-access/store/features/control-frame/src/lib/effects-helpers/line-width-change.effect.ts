import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import {
  ControlFrameEffectsActions,
  LineWidthButtonServiceActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { of, switchMap } from 'rxjs';
import { selectSelectedShapeIds } from '../control-frame.feature';

export const lineWidthChange = (actions$: Actions<Action>, store: Store) => {
  return createEffect(() => {
    return actions$.pipe(
      ofType(LineWidthButtonServiceActions.lineWidthChange),
      concatLatestFrom(() => [store.select(selectSelectedShapeIds)]),
      switchMap(([action, selectedShapeIds]) => {
        if (selectedShapeIds.length > 0) {
          return of(
            ControlFrameEffectsActions.selectedShapesLineWidthChange({
              lineWidth: action.lineWidth,
              selectedShapeIds,
            })
          );
        } else {
          return of(
            ControlFrameEffectsActions.lineWidthChange({ lineWidth: action.lineWidth })
          );
        }
      })
    );
  });
};
