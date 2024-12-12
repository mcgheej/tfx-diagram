import { Connection, Group, Shape } from '@tfx-diagram/diagram/data-access/shape-classes';
import { Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';
import { nanoid } from 'nanoid';

export interface AlignResult {
  modifiedShapes: Shape[];
  compromisedConnectionIds: string[];
}

export const linkDuplicatedShapesToPage = (
  newShapes: Shape[],
  shapes: Map<string, Shape>,
  lastShapeId: string,
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
  offset: Point,
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
          (s as Group).copy({ id: newId, groupId, groupMemberIds: subGroupNewIds }),
        );
        duplicatedShapes.push(
          ...duplicateShapesFromIds(
            newId,
            (s as Group).groupMemberIds,
            subGroupNewIds,
            shapes,
            offset,
          ),
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

export function alignLeft(
  alignRect: Rect,
  selectedShapeIds: string[],
  shapes: Map<string, Shape>,
  connections: Map<string, Connection>,
): AlignResult {
  const alignedShapes = new Map<string, Shape>();
  for (let i = 1; i < selectedShapeIds.length; i++) {
    const s = shapes.get(selectedShapeIds[i]);
    if (s) {
      if (s.shapeType === 'group') {
        const r = (s as Group).boundingBox(shapes);
        const groupShapes = Group.drawableShapes(s as Group, shapes);
        for (const g of groupShapes) {
          alignedShapes.set(g.id, g.move({ x: alignRect.x - r.x, y: 0 }));
        }
      } else {
        const r = s.boundingBox();
        alignedShapes.set(s.id, s.move({ x: alignRect.x - r.x, y: 0 }));
      }
    }
  }
  const result = processConnections(selectedShapeIds, shapes, connections, alignedShapes);
  return {
    modifiedShapes: [...result.modifiedShapes.values()],
    compromisedConnectionIds: [...result.compromisedConnections.values()].map(
      (c) => c.id,
    ),
  };
}

export function alignCenter(
  alignRect: Rect,
  selectedShapeIds: string[],
  shapes: Map<string, Shape>,
  connections: Map<string, Connection>,
): AlignResult {
  const alignedShapes = new Map<string, Shape>();
  const xA = alignRect.x + alignRect.width / 2;
  for (let i = 1; i < selectedShapeIds.length; i++) {
    const s = shapes.get(selectedShapeIds[i]);
    if (s) {
      if (s.shapeType === 'group') {
        const rS = (s as Group).boundingBox(shapes);
        const xS = rS.x + rS.width / 2;
        const groupShapes = Group.drawableShapes(s as Group, shapes);
        for (const g of groupShapes) {
          alignedShapes.set(g.id, g.move({ x: xA - xS, y: 0 }));
        }
      } else {
        const rS = s.boundingBox();
        const xS = rS.x + rS.width / 2;
        alignedShapes.set(s.id, s.move({ x: xA - xS, y: 0 }));
      }
    }
  }
  const result = processConnections(selectedShapeIds, shapes, connections, alignedShapes);
  return {
    modifiedShapes: [...result.modifiedShapes.values()],
    compromisedConnectionIds: [...result.compromisedConnections.values()].map(
      (c) => c.id,
    ),
  };
}

export function alignRight(
  alignRect: Rect,
  selectedShapeIds: string[],
  shapes: Map<string, Shape>,
  connections: Map<string, Connection>,
): AlignResult {
  const alignedShapes = new Map<string, Shape>();
  const xA = alignRect.x + alignRect.width;
  for (let i = 1; i < selectedShapeIds.length; i++) {
    const s = shapes.get(selectedShapeIds[i]);
    if (s) {
      if (s.shapeType === 'group') {
        const r = (s as Group).boundingBox(shapes);
        const xS = r.x + r.width;
        const groupShapes = Group.drawableShapes(s as Group, shapes);
        for (const g of groupShapes) {
          alignedShapes.set(g.id, g.move({ x: xA - xS, y: 0 }));
        }
      } else {
        const r = s.boundingBox();
        const xS = r.x + r.width;
        alignedShapes.set(s.id, s.move({ x: xA - xS, y: 0 }));
      }
    }
  }
  const result = processConnections(selectedShapeIds, shapes, connections, alignedShapes);
  return {
    modifiedShapes: [...result.modifiedShapes.values()],
    compromisedConnectionIds: [...result.compromisedConnections.values()].map(
      (c) => c.id,
    ),
  };
}

export function alignTop(
  alignRect: Rect,
  selectedShapeIds: string[],
  shapes: Map<string, Shape>,
  connections: Map<string, Connection>,
): AlignResult {
  const alignedShapes = new Map<string, Shape>();
  for (let i = 1; i < selectedShapeIds.length; i++) {
    const s = shapes.get(selectedShapeIds[i]);
    if (s) {
      if (s.shapeType === 'group') {
        const r = (s as Group).boundingBox(shapes);
        const groupShapes = Group.drawableShapes(s as Group, shapes);
        for (const g of groupShapes) {
          alignedShapes.set(g.id, g.move({ x: 0, y: alignRect.y - r.y }));
        }
      } else {
        const r = s.boundingBox();
        alignedShapes.set(s.id, s.move({ x: 0, y: alignRect.y - r.y }));
      }
    }
  }
  const result = processConnections(selectedShapeIds, shapes, connections, alignedShapes);
  return {
    modifiedShapes: [...result.modifiedShapes.values()],
    compromisedConnectionIds: [...result.compromisedConnections.values()].map(
      (c) => c.id,
    ),
  };
}

export function alignMiddle(
  alignRect: Rect,
  selectedShapeIds: string[],
  shapes: Map<string, Shape>,
  connections: Map<string, Connection>,
): AlignResult {
  const alignedShapes = new Map<string, Shape>();
  const yA = alignRect.y + alignRect.height / 2;
  for (let i = 1; i < selectedShapeIds.length; i++) {
    const s = shapes.get(selectedShapeIds[i]);
    if (s) {
      if (s.shapeType === 'group') {
        const rS = (s as Group).boundingBox(shapes);
        const yS = rS.y + rS.height / 2;
        const groupShapes = Group.drawableShapes(s as Group, shapes);
        for (const g of groupShapes) {
          alignedShapes.set(g.id, g.move({ x: 0, y: yA - yS }));
        }
      } else {
        const rS = s.boundingBox();
        const yS = rS.y + rS.height / 2;
        alignedShapes.set(s.id, s.move({ x: 0, y: yA - yS }));
      }
    }
  }
  const result = processConnections(selectedShapeIds, shapes, connections, alignedShapes);
  return {
    modifiedShapes: [...result.modifiedShapes.values()],
    compromisedConnectionIds: [...result.compromisedConnections.values()].map(
      (c) => c.id,
    ),
  };
}

export function alignBottom(
  alignRect: Rect,
  selectedShapeIds: string[],
  shapes: Map<string, Shape>,
  connections: Map<string, Connection>,
): AlignResult {
  const alignedShapes = new Map<string, Shape>();
  const yA = alignRect.y + alignRect.height;
  for (let i = 1; i < selectedShapeIds.length; i++) {
    const s = shapes.get(selectedShapeIds[i]);
    if (s) {
      if (s.shapeType === 'group') {
        const r = (s as Group).boundingBox(shapes);
        const yS = r.y + r.height;
        const groupShapes = Group.drawableShapes(s as Group, shapes);
        for (const g of groupShapes) {
          alignedShapes.set(g.id, g.move({ x: 0, y: yA - yS }));
        }
      } else {
        const r = s.boundingBox();
        const yS = r.y + r.height;
        alignedShapes.set(s.id, s.move({ x: 0, y: yA - yS }));
      }
    }
  }
  const result = processConnections(selectedShapeIds, shapes, connections, alignedShapes);
  return {
    modifiedShapes: [...result.modifiedShapes.values()],
    compromisedConnectionIds: [...result.compromisedConnections.values()].map(
      (c) => c.id,
    ),
  };
}

function processConnections(
  selectedShapeIds: string[],
  shapes: Map<string, Shape>,
  connections: Map<string, Connection>,
  modifiedShapes: Map<string, Shape>,
): {
  modifiedShapes: Map<string, Shape>;
  compromisedConnections: Map<string, Connection>;
} {
  const compromisedConnections = new Map<string, Connection>();
  connections.forEach((connection) => {
    // If the associated connector or shape is selected for
    // alignment then the connection is compromised.
    const c = shapes.get(connection.connectorId);
    const s = shapes.get(connection.shapeId);
    if (s && c) {
      if (
        shapeSelected(s, selectedShapeIds, shapes) ||
        shapeSelected(c, selectedShapeIds, shapes)
      ) {
        compromisedConnections.set(connection.id, connection);
      }
    } else {
      compromisedConnections.set(connection.id, connection);
    }
  });
  return { modifiedShapes, compromisedConnections };
}

function shapeSelected(
  s: Shape,
  selectedShapeIds: string[],
  shapes: Map<string, Shape>,
): boolean {
  if (s.groupId) {
    const groupId = Group.topLevelGroupIdFromId(s.groupId, shapes);
    return selectedShapeIds.includes(groupId);
  }
  return selectedShapeIds.includes(s.id);
}
