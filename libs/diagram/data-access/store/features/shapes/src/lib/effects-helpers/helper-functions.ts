import { Group, Shape } from '@tfx-diagram/diagram/data-access/shape-classes';
import { Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { nanoid } from 'nanoid';

export const linkDuplicatedShapesToPage = (
  newShapes: Shape[],
  shapes: Map<string, Shape>,
  lastShapeId: string
): Shape[] => {
  if (newShapes.length === 0) {
    return [];
  }
  const lastShape = shapes.get(lastShapeId);
  if (lastShape) {
    const modifiedLastShape = lastShape.copy({ nextShapeId: newShapes[0].id });
    newShapes[0].prevShapeId = modifiedLastShape.id;
    return [...newShapes, modifiedLastShape];
  }
  return newShapes;
};

export const duplicateShapesFromIds = (
  groupId: string,
  ids: string[],
  newIds: string[],
  shapes: Map<string, Shape>,
  offset: Point
): Shape[] => {
  const duplicatedShapes: Shape[] = [];
  for (let i = 0; i < ids.length; i++) {
    const s = shapes.get(ids[i]);
    if (s) {
      const newId = newIds[i];
      if (s.shapeType !== 'group') {
        duplicatedShapes.push(s.copy({ id: newId, groupId }).move(offset));
      } else {
        const subGroupNewIds = getNewIdsFromIds((s as Group).groupMemberIds, shapes);
        duplicatedShapes.push(
          (s as Group).copy({ id: newId, groupId, groupMemberIds: subGroupNewIds })
        );
        duplicatedShapes.push(
          ...duplicateShapesFromIds(
            newId,
            (s as Group).groupMemberIds,
            subGroupNewIds,
            shapes,
            offset
          )
        );
      }
    }
  }
  return duplicatedShapes;
};

export const getNewIdsFromIds = (ids: string[], shapes: Map<string, Shape>): string[] => {
  const newIds: string[] = [];
  for (const id of ids) {
    const s = shapes.get(id);
    if (s) {
      if (s.shapeType === 'group') {
        newIds.push(nanoid());
      } else {
        newIds.push(Shape.generateId());
      }
    }
  }
  return newIds;
};
