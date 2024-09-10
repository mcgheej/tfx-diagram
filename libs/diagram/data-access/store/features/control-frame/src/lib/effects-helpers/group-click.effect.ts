import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import {
  ControlFrameEffectsActions,
  ShapesEffectsActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { Shape } from '@tfx-diagram/diagram/data-access/shape-classes';
// import {
//   getGroupBoundingRect,
//   groupSelectFrame,
// } from '@tfx-diagram/diagram/data-access/shape-classes';
import { selectShapes } from '@tfx-diagram/diagram/data-access/store/features/shapes';
import { filter, of, switchMap } from 'rxjs';

export const groupClick = (actions$: Actions<Action>, store: Store) => {
  return createEffect(() => {
    return actions$.pipe(
      ofType(ShapesEffectsActions.groupClick),
      concatLatestFrom(() => [store.select(selectShapes)]),
      filter(([action]) => action.selectedShapeIds.length === 1),
      switchMap(([action, shapes]) => {
        let frameShapes: Shape[] = [];
        let selectedShapeIds: string[] = [];
        const g = shapes.get(action.selectedShapeIds[0]);
        if (g) {
          frameShapes = g.selectFrame(shapes);
          selectedShapeIds = [g.id];
        }
        return of(
          ControlFrameEffectsActions.selectionChange({
            selectedShapeIds,
            frameShapes,
          })
        );
      })
    );
  });
};
