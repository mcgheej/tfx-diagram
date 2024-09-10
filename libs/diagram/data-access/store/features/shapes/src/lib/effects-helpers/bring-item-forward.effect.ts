import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import {
  ArrangeMenuActions,
  ShapesEffectsActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { selectCurrentPage } from '@tfx-diagram/diagram-data-access-store-features-pages';
import { Shape, bringShapeForward } from '@tfx-diagram/diagram/data-access/shape-classes';
import { Page } from '@tfx-diagram/electron-renderer-web/shared-types';
import { filter, of, switchMap } from 'rxjs';
import { selectShapes } from '../shapes.feature';

export const bringItemForward = (actions$: Actions<Action>, store: Store) => {
  return createEffect(() => {
    return actions$.pipe(
      ofType(ArrangeMenuActions.bringItemForward),
      concatLatestFrom(() => [store.select(selectCurrentPage), store.select(selectShapes)]),
      filter(([, page]) => page !== null),
      switchMap(([action, page, shapes]) => {
        const { selectedShapeId } = action;
        const { id: pageId, firstShapeId, lastShapeId } = page as Page;
        const { newFirstId, newLastId, modifiedShapes } = bringShapeForward(
          selectedShapeId,
          new Map<string, Shape>(),
          shapes,
          firstShapeId,
          lastShapeId
        );
        return of(
          ShapesEffectsActions.bringItemForward({
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
