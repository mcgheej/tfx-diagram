import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Action, Store } from '@ngrx/store';
import {
  ControlFrameEffectsActions,
  EndpointButtonsServiceActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { of, switchMap } from 'rxjs';
import { selectSelectedShapeIds } from '../control-frame.feature';

export const startEndpointChange = (actions$: Actions<Action>, store: Store) => {
  return createEffect(() => {
    return actions$.pipe(
      ofType(EndpointButtonsServiceActions.startEndpointChange),
      concatLatestFrom(() => [store.select(selectSelectedShapeIds)]),
      switchMap(([action, selectedShapeIds]) => {
        if (selectedShapeIds.length > 0) {
          return of(
            ControlFrameEffectsActions.selectedShapesStartEndpointChange({
              endpoint: action.endpoint,
              selectedShapeIds,
            })
          );
        } else {
          return of(
            ControlFrameEffectsActions.startEndpointChange({ endpoint: action.endpoint })
          );
        }
      })
    );
  });
};
