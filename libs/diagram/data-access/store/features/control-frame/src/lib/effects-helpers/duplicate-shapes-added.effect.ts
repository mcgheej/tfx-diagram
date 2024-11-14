import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Action, Store } from '@ngrx/store';
import {
  ControlFrameEffectsActions,
  ShapesEffectsActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { Shape } from '@tfx-diagram/diagram/data-access/shape-classes';
import { selectShapes } from '@tfx-diagram/diagram/data-access/store/features/shapes';
import { of, switchMap } from 'rxjs';
import { getMultiSelectControlFrame } from '../misc-functions';

export const duplicateShapesAdded = (actions$: Actions<Action>, store: Store) => {
  return createEffect(() => {
    return actions$.pipe(
      ofType(
        ShapesEffectsActions.duplicatedShapesOnPage,
        ShapesEffectsActions.pasteShapesOnPage
      ),
      concatLatestFrom(() => [store.select(selectShapes)]),
      switchMap(([action, shapes]) => {
        let frameShapes: Shape[] = [];
        if (action.newShapeIds.length === 1) {
          const newShape = shapes.get(action.newShapeIds[0]);
          if (newShape) {
            frameShapes = newShape.selectFrame(shapes);
          }
        } else if (action.newShapeIds.length > 1) {
          frameShapes = getMultiSelectControlFrame(action.newShapeIds, shapes);
        }
        return of(
          ControlFrameEffectsActions.selectionChange({
            selectedShapeIds: action.newShapeIds,
            frameShapes,
          })
        );
      })
    );
  });
};
