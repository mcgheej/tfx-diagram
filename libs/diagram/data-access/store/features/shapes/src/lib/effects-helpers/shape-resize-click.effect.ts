import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Shape } from '@tfx-diagram/diagram-data-access-shape-base-class';
import {
  ArrangeMenuActions,
  ShapesEffectsActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { filter, of, switchMap } from 'rxjs';
import { selectShapes } from '../shapes.feature';

export const shapeResizeClick = (actions$: Actions<Action>, store: Store) => {
  return createEffect(() => {
    return actions$.pipe(
      ofType(ArrangeMenuActions.shapeResizeClick),
      concatLatestFrom(() => [store.select(selectShapes)]),
      filter(([action]) => action.selectedShapeIds.length > 1),
      switchMap(([{ selectedShapeIds, resizeOption }, shapes]) => {
        const modifiedShapes: Shape[] = [];
        const s = shapes.get(selectedShapeIds[0]);
        if (s && s.shapeType !== 'group') {
          const r = s.boundingBox();
          selectedShapeIds.slice(1).map((id) => {
            const t = shapes.get(id);
            if (t && t.shapeType !== 'group') {
              modifiedShapes.push(t.resizeToBox(r, resizeOption));
            }
          });
        }
        return of(
          ShapesEffectsActions.shapeResizeClick({ selectedShapeIds, shapes: modifiedShapes })
        );
      })
    );
  });
};
