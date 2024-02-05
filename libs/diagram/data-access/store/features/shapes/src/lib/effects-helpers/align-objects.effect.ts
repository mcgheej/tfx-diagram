import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Shape } from '@tfx-diagram/diagram-data-access-shape-base-class';
import {
  ArrangeMenuActions,
  ShapesEffectsActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { Group } from '@tfx-diagram/diagram/data-access/shape-classes';
import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';
import { filter, of, switchMap } from 'rxjs';
import { selectShapes } from '../shapes.feature';

export const alignObjects = (actions$: Actions<Action>, store: Store) => {
  return createEffect(() => {
    return actions$.pipe(
      ofType(ArrangeMenuActions.alignObjectsClick),
      concatLatestFrom(() => [store.select(selectShapes)]),
      filter(([action]) => action.selectedShapeIds.length > 1),
      switchMap(([action, shapes]) => {
        const { selectedShapeIds } = action;
        const pivotShape = shapes.get(selectedShapeIds[0]);
        let modifiedShapes: Shape[] = [];
        if (pivotShape) {
          switch (action.value) {
            case 'left': {
              modifiedShapes = alignLeft(pivotShape.boundingBox(), selectedShapeIds, shapes);
              break;
            }
            case 'center': {
              modifiedShapes = alignCenter(pivotShape.boundingBox(), selectedShapeIds, shapes);
              break;
            }
            case 'right': {
              modifiedShapes = alignRight(pivotShape.boundingBox(), selectedShapeIds, shapes);
              break;
            }
            case 'top': {
              modifiedShapes = alignTop(pivotShape.boundingBox(), selectedShapeIds, shapes);
              break;
            }
            case 'middle': {
              modifiedShapes = alignMiddle(pivotShape.boundingBox(), selectedShapeIds, shapes);
              break;
            }
            case 'bottom': {
              modifiedShapes = alignBottom(pivotShape.boundingBox(), selectedShapeIds, shapes);
              break;
            }
          }
        }
        return of(
          ShapesEffectsActions.alignObjects({
            selectedShapeIds,
            shapes: modifiedShapes,
          })
        );
      })
    );
  });
};

const alignLeft = (
  alignRect: Rect,
  selectedShapeIds: string[],
  shapes: Map<string, Shape>
): Shape[] => {
  const modifiedShapes: Shape[] = [];
  for (let i = 1; i < selectedShapeIds.length; i++) {
    const s = shapes.get(selectedShapeIds[i]);
    if (s) {
      const r = s.shapeType === 'group' ? (s as Group).boundingBox(shapes) : s.boundingBox();
      if (s.shapeType === 'group') {
        const groupShapes = Group.drawableShapes(s as Group, shapes);
        for (const g of groupShapes) {
          modifiedShapes.push(g.move({ x: alignRect.x - r.x, y: 0 }));
        }
      } else {
        modifiedShapes.push(s.move({ x: alignRect.x - r.x, y: 0 }));
      }
    }
  }
  return modifiedShapes;
};

const alignCenter = (
  alignRect: Rect,
  selectedShapeIds: string[],
  shapes: Map<string, Shape>
): Shape[] => {
  const modifiedShapes: Shape[] = [];
  const xA = alignRect.x + alignRect.width / 2;
  for (let i = 1; i < selectedShapeIds.length; i++) {
    const s = shapes.get(selectedShapeIds[i]);
    if (s) {
      const rS = s.shapeType === 'group' ? (s as Group).boundingBox(shapes) : s.boundingBox();
      const xS = rS.x + rS.width / 2;
      if (s.shapeType === 'group') {
        const groupShapes = Group.drawableShapes(s as Group, shapes);
        for (const g of groupShapes) {
          modifiedShapes.push(g.move({ x: xA - xS, y: 0 }));
        }
      } else {
        modifiedShapes.push(s.move({ x: xA - xS, y: 0 }));
      }
    }
  }
  return modifiedShapes;
};

const alignRight = (
  alignRect: Rect,
  selectedShapeIds: string[],
  shapes: Map<string, Shape>
): Shape[] => {
  const modifiedShapes: Shape[] = [];
  const xA = alignRect.x + alignRect.width;
  for (let i = 1; i < selectedShapeIds.length; i++) {
    const s = shapes.get(selectedShapeIds[i]);
    if (s) {
      const r = s.shapeType === 'group' ? (s as Group).boundingBox(shapes) : s.boundingBox();
      const xS = r.x + r.width;
      if (s.shapeType === 'group') {
        const groupShapes = Group.drawableShapes(s as Group, shapes);
        for (const g of groupShapes) {
          modifiedShapes.push(g.move({ x: xA - xS, y: 0 }));
        }
      } else {
        modifiedShapes.push(s.move({ x: xA - xS, y: 0 }));
      }
    }
  }
  return modifiedShapes;
};

const alignTop = (
  alignRect: Rect,
  selectedShapeIds: string[],
  shapes: Map<string, Shape>
): Shape[] => {
  const modifiedShapes: Shape[] = [];
  for (let i = 1; i < selectedShapeIds.length; i++) {
    const s = shapes.get(selectedShapeIds[i]);
    if (s) {
      const r = s.shapeType === 'group' ? (s as Group).boundingBox(shapes) : s.boundingBox();
      if (s.shapeType === 'group') {
        const groupShapes = Group.drawableShapes(s as Group, shapes);
        for (const g of groupShapes) {
          modifiedShapes.push(g.move({ x: 0, y: alignRect.y - r.y }));
        }
      } else {
        modifiedShapes.push(s.move({ x: 0, y: alignRect.y - r.y }));
      }
    }
  }
  return modifiedShapes;
};

const alignMiddle = (
  alignRect: Rect,
  selectedShapeIds: string[],
  shapes: Map<string, Shape>
): Shape[] => {
  const modifiedShapes: Shape[] = [];
  const yA = alignRect.y + alignRect.height / 2;
  for (let i = 1; i < selectedShapeIds.length; i++) {
    const s = shapes.get(selectedShapeIds[i]);
    if (s) {
      const rS = s.shapeType === 'group' ? (s as Group).boundingBox(shapes) : s.boundingBox();
      const yS = rS.y + rS.height / 2;
      if (s.shapeType === 'group') {
        const groupShapes = Group.drawableShapes(s as Group, shapes);
        for (const g of groupShapes) {
          modifiedShapes.push(g.move({ x: 0, y: yA - yS }));
        }
      } else {
        modifiedShapes.push(s.move({ x: 0, y: yA - yS }));
      }
    }
  }
  return modifiedShapes;
};

const alignBottom = (
  alignRect: Rect,
  selectedShapeIds: string[],
  shapes: Map<string, Shape>
): Shape[] => {
  const modifiedShapes: Shape[] = [];
  const yA = alignRect.y + alignRect.height;
  for (let i = 1; i < selectedShapeIds.length; i++) {
    const s = shapes.get(selectedShapeIds[i]);
    if (s) {
      const r = s.shapeType === 'group' ? (s as Group).boundingBox(shapes) : s.boundingBox();
      const yS = r.y + r.height;
      if (s.shapeType === 'group') {
        const groupShapes = Group.drawableShapes(s as Group, shapes);
        for (const g of groupShapes) {
          modifiedShapes.push(g.move({ x: 0, y: yA - yS }));
        }
      } else {
        modifiedShapes.push(s.move({ x: 0, y: yA - yS }));
      }
    }
  }
  return modifiedShapes;
};
