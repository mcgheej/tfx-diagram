import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import {
  ColorButtonsServiceActions,
  ControlFrameEffectsActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { of, switchMap } from 'rxjs';
import { selectSelectedShapeIds } from '../control-frame.feature';

export const colorChange = (actions$: Actions<Action>, store: Store) => {
  return createEffect(() => {
    return actions$.pipe(
      ofType(
        ColorButtonsServiceActions.fillColorChange,
        ColorButtonsServiceActions.lineColorChange
      ),
      concatLatestFrom(() => [store.select(selectSelectedShapeIds)]),
      switchMap(([action, selectedShapeIds]) => {
        if (selectedShapeIds.length > 0) {
          if (action.type === ColorButtonsServiceActions.LINE_COLOR_CHANGE) {
            return of(
              ControlFrameEffectsActions.selectedShapesLineColorChange({
                lineColor: action.lineColor,
                selectedShapeIds,
              })
            );
          }
          return of(
            ControlFrameEffectsActions.selectedShapesFillColorChange({
              fillColor: action.fillColor,
              selectedShapeIds,
            })
          );
        } else {
          if (action.type === ColorButtonsServiceActions.LINE_COLOR_CHANGE) {
            return of(
              ControlFrameEffectsActions.lineColorChange({ lineColor: action.lineColor })
            );
          }
          return of(
            ControlFrameEffectsActions.fillColorChange({ fillColor: action.fillColor })
          );
        }
      })
    );
  });
};
