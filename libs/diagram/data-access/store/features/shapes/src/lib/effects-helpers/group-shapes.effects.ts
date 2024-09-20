import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import {
  ArrangeMenuActions,
  ShapesEffectsActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { selectCurrentPage } from '@tfx-diagram/diagram-data-access-store-features-pages';
import {
  Group,
  bringShapesToFrontById,
  getShape,
} from '@tfx-diagram/diagram/data-access/shape-classes';
import { Page } from '@tfx-diagram/electron-renderer-web/shared-types';
import { nanoid } from 'nanoid';
import { filter, of, switchMap } from 'rxjs';
import { selectShapes } from '../shapes.feature';

export const groupShapes = (actions$: Actions<Action>, store: Store) => {
  return createEffect(() => {
    return actions$.pipe(
      ofType(ArrangeMenuActions.groupClick),
      concatLatestFrom(() => [
        store.select(selectCurrentPage),
        store.select(selectShapes),
      ]),
      filter(([action, page]) => {
        return action.selectedShapeIds.length > 1 && page !== null;
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
        const groupId = nanoid();
        modifiedShapes.set(
          groupId,
          new Group({ id: groupId, groupMemberIds: [...selectedShapeIds] })
        );
        for (const id of selectedShapeIds) {
          const s = getShape(id, modifiedShapes, shapes);
          if (s) {
            s.groupId = groupId;
            modifiedShapes.set(id, s);
          }
        }
        return of(
          ShapesEffectsActions.groupClick({
            selectedShapeIds: [groupId],
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
