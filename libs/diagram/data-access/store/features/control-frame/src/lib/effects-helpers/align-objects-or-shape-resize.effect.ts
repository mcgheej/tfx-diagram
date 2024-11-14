import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Action, Store } from '@ngrx/store';
import {
  ControlFrameEffectsActions,
  ShapesEffectsActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { selectShapes } from '@tfx-diagram/diagram/data-access/store/features/shapes';
import { filter, of, switchMap } from 'rxjs';
import { getMultiSelectControlFrame } from '../misc-functions';

export const arrangeObjects = (actions$: Actions<Action>, store: Store) => {
  return createEffect(() => {
    return actions$.pipe(
      ofType(
        ShapesEffectsActions.alignObjects,
        ShapesEffectsActions.shapeResizeClick,
        ShapesEffectsActions.distributeObjects
      ),
      concatLatestFrom(() => [store.select(selectShapes)]),
      filter(([action]) => action.selectedShapeIds.length > 1),
      switchMap(([action, shapes]) => {
        return of(
          ControlFrameEffectsActions.selectionChange({
            selectedShapeIds: action.selectedShapeIds,
            frameShapes: getMultiSelectControlFrame(action.selectedShapeIds, shapes),
          })
        );
      })
    );
  });
};
