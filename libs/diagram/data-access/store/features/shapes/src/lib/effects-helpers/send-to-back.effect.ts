import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import {
  ArrangeMenuActions,
  ShapesEffectsActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { selectCurrentPage } from '@tfx-diagram/diagram-data-access-store-features-pages';
import {
  Shape,
  getDrawableShapeIdsInSelection,
  getShape,
  linkShapeArray,
  unlinkShapesById,
} from '@tfx-diagram/diagram/data-access/shape-classes';
import { Page } from '@tfx-diagram/electron-renderer-web/shared-types';
import { filter, of, switchMap } from 'rxjs';
import { selectShapes } from '../shapes.feature';

export const sendToBack = (actions$: Actions<Action>, store: Store) => {
  return createEffect(() => {
    return actions$.pipe(
      ofType(ArrangeMenuActions.sendToBackClick),
      concatLatestFrom(() => [store.select(selectCurrentPage), store.select(selectShapes)]),
      filter(([action, page]) => {
        return action.selectedShapeIds.length > 0 && page !== null;
      }),
      switchMap(([action, page, shapes]) => {
        const { selectedShapeIds } = action;
        const { id: pageId, firstShapeId, lastShapeId } = page as Page;
        const result = unlinkShapesById(
          getDrawableShapeIdsInSelection(selectedShapeIds, shapes),
          new Map<string, Shape>(),
          shapes,
          firstShapeId,
          lastShapeId
        );
        let { selectedShapes, newFirstId, newLastId } = result;
        const { modifiedShapes } = result;
        selectedShapes = linkShapeArray(selectedShapes);
        selectedShapes.map((s) => modifiedShapes.set(s.id, s));
        const l = selectedShapes.length - 1;
        const f = getShape(newFirstId, modifiedShapes, shapes);
        if (f) {
          newFirstId = selectedShapes[0].id;
          selectedShapes[l].nextShapeId = f.id;
          f.prevShapeId = selectedShapes[l].id;
          modifiedShapes.set(f.id, f);
        } else {
          newFirstId = selectedShapes[0].id;
          newLastId = selectedShapes[l].id;
        }
        return of(
          ShapesEffectsActions.sendToBack({
            shapes: [...modifiedShapes.values()],
            pageId,
            firstShapeId: newFirstId,
            lastShapeId: newLastId,
          })
        );
      })
    );
  });
};
