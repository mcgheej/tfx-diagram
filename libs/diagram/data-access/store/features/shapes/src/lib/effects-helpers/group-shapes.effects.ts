import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import {
  ArrangeMenuActions,
  ShapesEffectsActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import {
  Group,
  Shape,
  getShapeArrayFromIdArray,
} from '@tfx-diagram/diagram/data-access/shape-classes';
import { nanoid } from 'nanoid';
import { filter, of, switchMap } from 'rxjs';
import { selectShapes } from '../shapes.feature';

export const groupShapes = (actions$: Actions<Action>, store: Store) => {
  return createEffect(() => {
    return actions$.pipe(
      ofType(ArrangeMenuActions.groupClick),
      concatLatestFrom(() => [store.select(selectShapes)]),
      filter(([action]) => action.selectedShapeIds.length > 1),
      switchMap(([action, shapes]) => {
        const modifiedShapes: Shape[] = [];
        let selectedShapeIds: string[] = [];

        const selectedShapes = getShapeArrayFromIdArray(action.selectedShapeIds, shapes);
        if (selectedShapes.length === action.selectedShapeIds.length) {
          // All selected items available so create new group shape and modify
          // selected items to belong to new group by setting 'groupId' property.
          const groupId = nanoid();
          modifiedShapes.push(
            new Group({ id: groupId, groupMemberIds: [...action.selectedShapeIds] })
          );
          for (const s of selectedShapes) {
            modifiedShapes.push(s.copy({ groupId }));
          }
          selectedShapeIds = [groupId];
        }
        return of(
          ShapesEffectsActions.groupClick({
            selectedShapeIds,
            shapes: modifiedShapes,
          })
        );
      })
    );
  });
};
