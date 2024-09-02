import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Shape, linkShapeArray } from '@tfx-diagram/diagram-data-access-shape-base-class';
import {
  EditMenuActions,
  PageBackgroundContextMenuActions,
  ShapesEffectsActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { selectCurrentPage } from '@tfx-diagram/diagram-data-access-store-features-pages';
import { rectUnionArray } from '@tfx-diagram/diagram/util/misc-functions';
import { Page, Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';
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
      ofType(EditMenuActions.pasteClick, PageBackgroundContextMenuActions.pasteClick),
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
      switchMap(([action, page, copyBuffer, currentPasteCount, shapes]) => {
        const { id: pageId, lastShapeId } = page as Page;
        const topLevelIds: string[] = [];
        const boundingBoxes: Rect[] = [];
        const copyBufferMap: Map<string, Shape> = new Map();
        for (const s of copyBuffer) {
          copyBufferMap.set(s.id, s);
          if (s.groupId === '') {
            topLevelIds.push(s.id);
          }
          if (s.shapeType !== 'group') {
            boundingBoxes.push(s.boundingBox());
          }
        }
        let offset = { x: 0, y: 0 } as Point;
        let pasteCount = currentPasteCount;
        if (action.type === PageBackgroundContextMenuActions.PASTE_CLICK) {
          // Need to calculate bounding box for contents of copy buffer.
          // use this to compute the required offset to place the pasted
          // shapes centred on the mouse position.
          const b = rectUnionArray(boundingBoxes);
          const p = action.position;
          offset = {
            x: p.x - (b.x + b.width / 2),
            y: p.y - (b.y + b.height / 2),
          };
        } else {
          pasteCount = currentPasteCount + 1;
          const t = pasteCount * 5;
          offset = { x: t, y: t };
        }
        let newShapes = duplicateShapesFromIds(
          '',
          topLevelIds,
          getNewIdsFromIds(topLevelIds, shapes),
          copyBufferMap,
          offset
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
            pasteCount,
          })
        );
      })
    );
  });
};
