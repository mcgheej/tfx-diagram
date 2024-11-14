import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Action, Store } from '@ngrx/store';
import {
  ArrangeMenuActions,
  ShapesEffectsActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { Group, Shape } from '@tfx-diagram/diagram/data-access/shape-classes';
import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';
import { filter, of, switchMap } from 'rxjs';
import { selectShapes } from '../shapes.feature';

export const distributeObjects = (actions$: Actions<Action>, store: Store) => {
  return createEffect(() => {
    return actions$.pipe(
      ofType(ArrangeMenuActions.distributeObjectsClick),
      concatLatestFrom(() => [store.select(selectShapes)]),
      filter(([action]) => action.selectedShapeIds.length > 1),
      switchMap(([action, shapes]) => {
        const { selectedShapeIds, value: direction } = action;
        let modifiedShapes: Shape[] = [];
        if (direction === 'horizontally') {
          modifiedShapes = distributeHorizontally(selectedShapeIds, shapes);
        } else {
          modifiedShapes = distributeVertically(selectedShapeIds, shapes);
        }
        return of(
          ShapesEffectsActions.distributeObjects({
            selectedShapeIds,
            shapes: modifiedShapes,
          })
        );
      })
    );
  });
};

const distributeVertically = (
  selectedShapeIds: string[],
  shapes: Map<string, Shape>
): Shape[] => {
  if (selectedShapeIds.length < 3) {
    return [];
  }

  const { items, boundingBoxes } = getItemsAndBoundingBoxes(selectedShapeIds, shapes);
  if (items.length < 3 || items.length !== boundingBoxes.length) {
    return [];
  }

  // Calculate space required and space available and bail out if
  // not enough space to distribute intermediary items.
  const firstBox = boundingBoxes[0];
  const lastBox = boundingBoxes[items.length - 1];
  const spaceAvailable = lastBox.y - (firstBox.y + firstBox.height);
  let spaceRequired = 0;
  for (const box of boundingBoxes.slice(1, items.length - 1)) {
    spaceRequired += box.height;
  }
  if (spaceAvailable < spaceRequired) {
    return [];
  }

  const gap = (spaceAvailable - spaceRequired) / (items.length - 1);
  let gapStart = firstBox.y + firstBox.height;
  const modifiedShapes: Shape[] = [];
  for (let i = 1; i < items.length - 1; i++) {
    const box = boundingBoxes[i];
    const item = items[i];
    const newY = gapStart + gap;
    if (item.shapeType === 'group') {
      const groupShapes = Group.drawableShapes(item as Group, shapes);
      for (const g of groupShapes) {
        modifiedShapes.push(g.move({ x: 0, y: newY - box.y }));
      }
    } else {
      modifiedShapes.push(item.move({ x: 0, y: newY - box.y }));
    }
    gapStart = newY + box.height;
  }

  return modifiedShapes;
};

const distributeHorizontally = (
  selectedShapeIds: string[],
  shapes: Map<string, Shape>
): Shape[] => {
  if (selectedShapeIds.length < 3) {
    return [];
  }

  const { items, boundingBoxes } = getItemsAndBoundingBoxes(selectedShapeIds, shapes);
  if (items.length < 3 || items.length !== boundingBoxes.length) {
    return [];
  }

  // Calculate space required and space available and bail out if
  // not enough space to distribute intermediary items.
  const firstBox = boundingBoxes[0];
  const lastBox = boundingBoxes[items.length - 1];
  const spaceAvailable = lastBox.x - (firstBox.x + firstBox.width);
  let spaceRequired = 0;
  for (const box of boundingBoxes.slice(1, items.length - 1)) {
    spaceRequired += box.width;
  }
  if (spaceAvailable < spaceRequired) {
    return [];
  }

  const gap = (spaceAvailable - spaceRequired) / (items.length - 1);
  let gapStart = firstBox.x + firstBox.width;
  const modifiedShapes: Shape[] = [];
  for (let i = 1; i < items.length - 1; i++) {
    const box = boundingBoxes[i];
    const item = items[i];
    const newX = gapStart + gap;
    if (item.shapeType === 'group') {
      const groupShapes = Group.drawableShapes(item as Group, shapes);
      for (const g of groupShapes) {
        modifiedShapes.push(g.move({ x: newX - box.x, y: 0 }));
      }
    } else {
      modifiedShapes.push(item.move({ x: newX - box.x, y: 0 }));
    }
    gapStart = newX + box.width;
  }

  return modifiedShapes;
};

const getItemsAndBoundingBoxes = (
  itemIds: string[],
  shapes: Map<string, Shape>
): { items: Shape[]; boundingBoxes: Rect[] } => {
  // Scan through selected items and build two arrays;
  // selectedItems and boundingBoxes. If problem accessing
  // a shape/item then return empty arrays. Arrays will
  // always have the same number of elements.
  const items: Shape[] = [];
  const boundingBoxes: Rect[] = [];
  for (const id of itemIds) {
    const s = shapes.get(id);
    if (s) {
      items.push(s);
      boundingBoxes.push(
        s.shapeType === 'group' ? (s as Group).boundingBox(shapes) : s.boundingBox()
      );
    } else {
      return { items: [], boundingBoxes: [] };
    }
  }
  return { items, boundingBoxes };
};
