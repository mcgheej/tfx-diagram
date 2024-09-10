import {
  getShapesArrayFromIdArray,
  gridSnapPoint,
  Group,
  linkShapeArray,
  RectangleOutline,
  Shape,
} from '@tfx-diagram/diagram-data-access-shape-base-class';
import { pointSubtract, rectUnionArray } from '@tfx-diagram/diagram/util/misc-functions';
import { GridProps, Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';

export const snapShiftDelta = (
  mousePagePos: Point,
  dragOffset: Point,
  selectedShape: Shape,
  shapes: Map<string, Shape>,
  gridProps: GridProps
): Point => {
  const anchorPos = selectedShape.anchor(shapes);
  const newAnchorPos = pointSubtract(mousePagePos, dragOffset);
  if (!gridProps.gridSnap) {
    return pointSubtract(newAnchorPos, anchorPos);
  }
  const snappedAnchorPos = gridSnapPoint(newAnchorPos, gridProps);
  const snappedShiftDelta = pointSubtract(snappedAnchorPos, anchorPos);
  return snappedShiftDelta;
};

export const getMultiSelectControlFrame = (
  shapeIds: string[],
  shapes: Map<string, Shape>
): Shape[] => {
  const boundingBoxes: Rect[] = [];
  const frameShapes: Shape[] = [];
  for (const selectedShape of getShapesArrayFromIdArray(shapeIds, shapes)) {
    boundingBoxes.push(
      selectedShape.shapeType === 'group'
        ? (selectedShape as Group).boundingBox(shapes)
        : selectedShape.boundingBox()
    );
    frameShapes.push(...selectedShape.outlineShapes(shapes));
  }
  const { x, y, width, height } = rectUnionArray(boundingBoxes);
  frameShapes.push(new RectangleOutline({ id: Shape.generateId(), x, y, width, height }));
  linkShapeArray(frameShapes);
  return frameShapes;
};
