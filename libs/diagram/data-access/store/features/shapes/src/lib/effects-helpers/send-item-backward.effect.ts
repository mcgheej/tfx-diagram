import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Action, Store } from '@ngrx/store';
import {
  ArrangeMenuActions,
  ShapesEffectsActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { selectCurrentPage } from '@tfx-diagram/diagram-data-access-store-features-pages';
import { Shape, sendShapeBackward } from '@tfx-diagram/diagram/data-access/shape-classes';
import { Page } from '@tfx-diagram/electron-renderer-web/shared-types';
import { filter, of, switchMap } from 'rxjs';
import { selectShapes } from '../shapes.feature';

export const sendItemBackward = (actions$: Actions<Action>, store: Store) => {
  return createEffect(() => {
    return actions$.pipe(
      ofType(ArrangeMenuActions.sendItemBackward),
      concatLatestFrom(() => [store.select(selectCurrentPage), store.select(selectShapes)]),
      filter(([, page]) => page !== null),
      switchMap(([action, page, shapes]) => {
        const { selectedShapeId } = action;
        const { id: pageId, firstShapeId, lastShapeId } = page as Page;
        const { newFirstId, newLastId, modifiedShapes } = sendShapeBackward(
          selectedShapeId,
          new Map<string, Shape>(),
          shapes,
          firstShapeId,
          lastShapeId
        );
        return of(
          ShapesEffectsActions.sendItemBackward({
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
