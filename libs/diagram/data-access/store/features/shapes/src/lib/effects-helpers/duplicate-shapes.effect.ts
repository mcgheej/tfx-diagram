import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Action, Store } from '@ngrx/store';
import {
  EditMenuActions,
  ShapesEffectsActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { selectCurrentPage } from '@tfx-diagram/diagram-data-access-store-features-pages';
import { Shape, linkShapeArray } from '@tfx-diagram/diagram/data-access/shape-classes';
import { Page } from '@tfx-diagram/electron-renderer-web/shared-types';
import { filter, of, switchMap } from 'rxjs';
import { selectShapes } from '../shapes.feature';
import {
  duplicateShapesFromIds,
  getNewIdsFromIds,
  linkDuplicatedShapesToPage,
} from './helper-functions';

export const duplicateShapes = (actions$: Actions<Action>, store: Store) => {
  return createEffect(() => {
    return actions$.pipe(
      ofType(EditMenuActions.duplicateClick),
      concatLatestFrom(() => [store.select(selectCurrentPage), store.select(selectShapes)]),
      filter(([action, page]) => page !== null && action.selectedShapeIds.length > 0),
      switchMap(([action, page, shapes]) => {
        const { id: pageId, lastShapeId } = page as Page;
        const { selectedShapeIds } = action;
        let newShapes = duplicateShapesFromIds(
          '',
          selectedShapeIds,
          getNewIdsFromIds(selectedShapeIds, shapes),
          shapes,
          { x: 5, y: 5 }
        );
        const newDrawableShapes: Shape[] = [];
        const newGroupShapes: Shape[] = [];
        const newShapeIds: string[] = [];
        for (const s of newShapes) {
          if (s.shapeType === 'group') {
            newGroupShapes.push(s);
          } else {
            newDrawableShapes.push(s);
          }
          if (s.groupId === '') {
            newShapeIds.push(s.id);
          }
        }
        newShapes = [...linkShapeArray(newDrawableShapes), ...newGroupShapes];
        return of(
          ShapesEffectsActions.duplicatedShapesOnPage({
            newShapeIds,
            shapes: linkDuplicatedShapesToPage(newShapes, shapes, lastShapeId),
            pageId,
          })
        );
      })
    );
  });
};
