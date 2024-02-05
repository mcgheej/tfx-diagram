import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import {
  ControlFrameEffectsActions,
  LineDashButtonServiceActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { of, switchMap } from 'rxjs';
import { selectSelectedShapeIds } from '../control-frame.feature';

export const lineDashChange = (actions$: Actions<Action>, store: Store) => {
  return createEffect(() => {
    return actions$.pipe(
      ofType(LineDashButtonServiceActions.lineDashChange),
      concatLatestFrom(() => [store.select(selectSelectedShapeIds)]),
      switchMap(([action, selectedShapeIds]) => {
        if (selectedShapeIds.length > 0) {
          return of(
            ControlFrameEffectsActions.selectedShapesLineDashChange({
              lineDash: action.lineDash,
              selectedShapeIds,
            })
          );
        } else {
          return of(ControlFrameEffectsActions.lineDashChange({ lineDash: action.lineDash }));
        }
      })
    );
  });
};
