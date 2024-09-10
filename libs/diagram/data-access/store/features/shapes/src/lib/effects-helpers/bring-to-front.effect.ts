import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import {
  ArrangeMenuActions,
  ShapesEffectsActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { selectCurrentPage } from '@tfx-diagram/diagram-data-access-store-features-pages';
import { bringShapesToFrontById } from '@tfx-diagram/diagram/data-access/shape-classes';
import { Page } from '@tfx-diagram/electron-renderer-web/shared-types';
import { filter, of, switchMap } from 'rxjs';
import { selectShapes } from '../shapes.feature';

export const bringToFront = (actions$: Actions<Action>, store: Store) => {
  return createEffect(() => {
    return actions$.pipe(
      ofType(ArrangeMenuActions.bringToFrontClick),
      concatLatestFrom(() => [store.select(selectCurrentPage), store.select(selectShapes)]),
      filter(([action, page]) => {
        return action.selectedShapeIds.length > 0 && page !== null;
      }),
      switchMap(([action, page, shapes]) => {
        const { selectedShapeIds } = action;
        const { id: pageId, firstShapeId, lastShapeId } = page as Page;
        const { modifiedShapes, newFirstId, newLastId } = bringShapesToFrontById(
          selectedShapeIds,
          firstShapeId,
          lastShapeId,
          shapes
        );
        return of(
          ShapesEffectsActions.bringToFront({
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
