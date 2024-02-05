import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import {
  ControlFrameEffectsActions,
  MouseMachineActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { filter, of, switchMap } from 'rxjs';
import { selectSelectedShapeIds } from '../control-frame.feature';

export const doubleClick = (actions$: Actions<Action>, store: Store) => {
  return createEffect(() => {
    return actions$.pipe(
      ofType(MouseMachineActions.doubleClick),
      concatLatestFrom(() => [store.select(selectSelectedShapeIds)]),
      filter(([, selectedShapeIds]) => selectedShapeIds.length === 1),
      switchMap(([, selectedShapeIds]) => {
        return of(
          ControlFrameEffectsActions.editTextChange({
            shapeId: selectedShapeIds[0],
          })
        );
      })
    );
  });
};
