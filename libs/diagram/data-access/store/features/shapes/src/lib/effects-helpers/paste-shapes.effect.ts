import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { linkShapeArray, Shape } from '@tfx-diagram/diagram-data-access-shape-base-class';
import {
  EditMenuActions,
  ShapesEffectsActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { selectCurrentPage } from '@tfx-diagram/diagram-data-access-store-features-pages';
import { Page } from '@tfx-diagram/electron-renderer-web/shared-types';
import { filter, of, switchMap } from 'rxjs';
import { selectCopyBuffer, selectPasteCount, selectShapes } from '../shapes.feature';
import {
  duplicateShapesFromIds,
  getNewIdsFromIds,
  linkDuplicatedShapesToPage,
} from './helper-functions';

export const pasteShapes = (actions$: Actions<Action>, store: Store) => {
  return createEffect(() => {
    return actions$.pipe(
      ofType(EditMenuActions.pasteClick),
      concatLatestFrom(() => [
        store.select(selectCurrentPage),
        store.select(selectCopyBuffer),
        store.select(selectPasteCount),
        store.select(selectShapes),
      ]),
      filter(
        ([action, page, copyBuffer]) =>
          action.textEdit === null && page !== null && copyBuffer.length > 0
      ),
      switchMap(([, page, copyBuffer, pasteCount, shapes]) => {
        const { id: pageId, lastShapeId } = page as Page;
        const topLevelIds: string[] = [];
        const copyBufferMap: Map<string, Shape> = new Map();
        for (const s of copyBuffer) {
          copyBufferMap.set(s.id, s);
          if (s.groupId === '') {
            topLevelIds.push(s.id);
          }
        }
        const offset = (pasteCount + 1) * 5;
        let newShapes = duplicateShapesFromIds(
          '',
          topLevelIds,
          getNewIdsFromIds(topLevelIds, shapes),
          copyBufferMap,
          { x: offset, y: offset }
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
          ShapesEffectsActions.pasteShapesOnPage({
            newShapeIds,
            shapes: linkDuplicatedShapesToPage(newShapes, shapes, lastShapeId),
            pageId,
          })
        );
      })
    );
  });
};
