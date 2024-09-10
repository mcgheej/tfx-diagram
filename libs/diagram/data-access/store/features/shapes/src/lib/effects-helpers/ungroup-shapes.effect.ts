import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import {
  ArrangeMenuActions,
  ShapesEffectsActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { Group, Shape } from '@tfx-diagram/diagram/data-access/shape-classes';
import { filter, of, switchMap } from 'rxjs';
import { selectShapes } from '../shapes.feature';

export const ungroupShapes = (actions$: Actions<Action>, store: Store) => {
  return createEffect(() => {
    return actions$.pipe(
      ofType(ArrangeMenuActions.ungroupClick),
      concatLatestFrom(() => [store.select(selectShapes)]),
      filter(([action, shapes]) => {
        for (const id of action.selectedShapeIds) {
          const s = shapes.get(id);
          if (s && s.shapeType === 'group') {
            return true;
          }
        }
        return false;
      }),
      switchMap(([action, shapes]) => {
        const { modifiedShapes, deletedGroupIds } = ungroupShapesFromIds(
          action.selectedShapeIds,
          shapes
        );
        const selectedShapeIds = modifiedShapes.map((s) => s.id);
        return of(
          ShapesEffectsActions.ungroupClick({
            selectedShapeIds,
            deletedGroupIds,
            shapes: modifiedShapes,
          })
        );
      })
    );
  });
};

const ungroupShapesFromIds = (
  ids: string[],
  shapes: Map<string, Shape>
): { modifiedShapes: Shape[]; deletedGroupIds: string[] } => {
  const ungroupedItems: Shape[] = [];
  const deletedGroupIds: string[] = [];
  for (const id of ids) {
    const s = shapes.get(id);
    if (s) {
      if (s.shapeType === 'group') {
        deletedGroupIds.push(s.id);
        for (const groupMemberId of (s as Group).groupMemberIds) {
          const g = shapes.get(groupMemberId);
          if (g) {
            ungroupedItems.push(g.copy({ groupId: '' }));
          }
        }
      } else {
        ungroupedItems.push(s.copy({}));
      }
    }
  }
  return {
    modifiedShapes: ungroupedItems,
    deletedGroupIds,
  };
};
