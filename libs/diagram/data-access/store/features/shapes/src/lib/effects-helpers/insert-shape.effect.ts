// import { Actions, createEffect } from "@ngrx/effects";
// import { Action, Store } from "@ngrx/store";

// export const selectAll = (actions$: Actions<Action>, store: Store) => {
//   return createEffect(() => {
//     return actions$.pipe();
//   });
// }
import { Actions, createEffect, ofType } from '@ngrx/effects';import { concatLatestFrom } from '@ngrx/operators';

import { Action, Store } from '@ngrx/store';
import {
  InsertMenuActions,
  PageBackgroundContextMenuActions,
  ShapesEffectsActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { selectCurrentPage } from '@tfx-diagram/diagram-data-access-store-features-pages';
import { Shape } from '@tfx-diagram/diagram/data-access/shape-classes';
import { Page } from '@tfx-diagram/electron-renderer-web/shared-types';
import { filter, of, switchMap } from 'rxjs';
import { selectShapes } from '../shapes.feature';

export const insertShape = (actions$: Actions<Action>, store: Store) => {
  return createEffect(() => {
    return actions$.pipe(
      ofType(
        InsertMenuActions.insertCircle,
        InsertMenuActions.insertRectangle,
        InsertMenuActions.insertArc,
        InsertMenuActions.insertCurve,
        InsertMenuActions.insertLine,
        InsertMenuActions.insertTriangle,
        PageBackgroundContextMenuActions.insertCircle,
        PageBackgroundContextMenuActions.insertRectangle,
        PageBackgroundContextMenuActions.insertArc,
        PageBackgroundContextMenuActions.insertCurve,
        PageBackgroundContextMenuActions.insertLine,
        PageBackgroundContextMenuActions.insertTriangle
      ),
      concatLatestFrom(() => [store.select(selectCurrentPage), store.select(selectShapes)]),
      filter(([, page]) => page !== null),
      switchMap(([action, page, shapes]) => {
        const { id: pageId, firstShapeId, lastShapeId } = page as Page;
        if (firstShapeId) {
          return of(
            ShapesEffectsActions.anotherShapeOnPage({
              shapes: addShapeToPage(action.shape, shapes, lastShapeId),
              pageId,
            })
          );
        }
        return of(ShapesEffectsActions.firstShapeOnPage({ shape: action.shape, pageId }));
      })
    );
  });
};

const addShapeToPage = (
  newShape: Shape,
  shapes: Map<string, Shape>,
  lastShapeId: string
): Shape[] => {
  const lastShape = shapes.get(lastShapeId);
  if (lastShape) {
    // The new shape must always be the first shape in the return array!
    return [
      newShape.copy({ prevShapeId: lastShapeId }),
      lastShape.copy({ nextShapeId: newShape.id }),
    ];
  }
  return [];
};
