import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import {
  EditMenuActions,
  ShapesEffectsActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { selectCurrentPage } from '@tfx-diagram/diagram-data-access-store-features-pages';
import {
  Shape,
  getAllShapeIdsInSelection,
  unlinkShapesById,
} from '@tfx-diagram/diagram/data-access/shape-classes';
import { Page } from '@tfx-diagram/electron-renderer-web/shared-types';
import { filter, of, switchMap } from 'rxjs';
import { selectConnections, selectShapes } from '../shapes.feature';

export const deleteShapes = (actions$: Actions<Action>, store: Store) => {
  return createEffect(() => {
    return actions$.pipe(
      ofType(EditMenuActions.deleteClick, EditMenuActions.cutClick),
      concatLatestFrom(() => [
        store.select(selectCurrentPage),
        store.select(selectShapes),
        store.select(selectConnections),
      ]),
      filter(
        ([action, page]) =>
          page !== null && action.selectedShapeIds.length > 0 && action.textEdit === null
      ),
      switchMap(([action, page, shapes, connections]) => {
        const { id: pageId, firstShapeId, lastShapeId } = page as Page;
        const { selectedShapeIds } = action;
        const deletedConnectionIds: string[] = [];
        const deletedShapeIds = getAllShapeIdsInSelection(selectedShapeIds, shapes);
        connections.forEach((connection) => {
          if (deletedShapeIds.includes(connection.connectorId)) {
            deletedConnectionIds.push(connection.id);
          } else if (deletedShapeIds.includes(connection.shapeId)) {
            deletedConnectionIds.push(connection.id);
          }
        });
        const { newFirstId, newLastId, modifiedShapes } = unlinkShapesById(
          deletedShapeIds,
          new Map<string, Shape>(),
          shapes,
          firstShapeId,
          lastShapeId
        );
        return of(
          ShapesEffectsActions.deleteShapesOnPage({
            deletedShapeIds,
            deletedConnectionIds,
            modifiedShapes: [...modifiedShapes.values()],
            pageId,
            firstShapeId: newFirstId,
            lastShapeId: newLastId,
          })
        );
      })
    );
  });
};
