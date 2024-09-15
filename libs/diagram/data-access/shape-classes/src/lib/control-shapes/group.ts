import { rectUnionArray } from '@tfx-diagram/diagram/util/misc-functions';
import { ColorRef, Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';
import { ControlShape } from '../control-shape';
import { getShapeArrayFromIdArray } from '../misc-functions';
import {
  AllShapeProps,
  GroupConfig,
  GroupProps,
  ShapeProps,
  SharedProperties,
} from '../props';
import { Shape } from '../shape';
import { groupHighlightFrame } from './frames/group-highlight-frame';
import { groupSelectFrame } from './frames/group-select-frame';

const groupDefaults: Omit<GroupProps, keyof ShapeProps> = {
  groupMemberIds: [],
};

export class Group extends ControlShape implements GroupProps {
  // static members

  static highlightTopFrame(id: string, shapes: Map<string, Shape>): Shape[] {
    const topGroup = getTopLevelGroupFromId(id, shapes);
    if (topGroup) {
      return groupHighlightFrame(topGroup, shapes, topGroup.boundingBox(shapes));
    }
    return [];
  }

  static selectTopFrame(id: string, shapes: Map<string, Shape>): Shape[] {
    const topGroup = getTopLevelGroupFromId(id, shapes);
    if (topGroup) {
      return groupSelectFrame(topGroup.boundingBox(shapes));
    }
    return [];
  }

  static topLevelGroupIdFromId(id: string, shapes: Map<string, Shape>): string {
    let leadId = id;
    let s = shapes.get(id);
    while (s && s.groupId) {
      leadId = s.groupId;
      s = shapes.get(leadId);
    }
    return leadId;
  }

  static drawableShapeIds(group: Group, shapes: Map<string, Shape>): string[] {
    return getDrawableShapeIds(group, shapes);
  }

  static drawableShapes(group: Group, shapes: Map<string, Shape>): Shape[] {
    return getDrawableShapes(group, shapes);
  }

  static shapeIds(group: Group, shapes: Map<string, Shape>): string[] {
    return getAllShapeIds(group, shapes);
  }

  static shapes(group: Group, shapes: Map<string, Shape>): Shape[] {
    return getAllShapes(group, shapes);
  }

  groupMemberIds: string[];

  constructor(config: GroupConfig) {
    super({ ...config, shapeType: 'group', cursor: 'default' });
    this.groupMemberIds = config.groupMemberIds ?? groupDefaults.groupMemberIds;
  }

  anchor(shapes: Map<string, Shape>): Point {
    const drawableShapes = getDrawableShapes(this, shapes);
    if (drawableShapes.length > 1) {
      return drawableShapes[0].anchor();
    }
    return { x: 0, y: 0 };
  }

  boundingBox(shapes: Map<string, Shape> = new Map()): Rect {
    return getGroupBoundingRect(this, shapes);
  }

  colors(): { lineColor: ColorRef; fillColor: ColorRef } {
    return {
      lineColor: { colorSet: 'empty', ref: '' },
      fillColor: { colorSet: 'empty', ref: '' },
    };
  }

  copy(amendments: Partial<AllShapeProps>): Group {
    const a = amendments as Partial<SharedProperties<GroupProps, AllShapeProps>>;
    const g = new Group({
      id: a.id ?? this.id,
      prevShapeId: a.prevShapeId ?? this.prevShapeId,
      nextShapeId: a.nextShapeId ?? this.nextShapeId,
      groupId: a.groupId ?? this.groupId,
      cursor: a.cursor ?? this.cursor,
      selectable: a.selectable ?? this.selectable,
      visible: a.visible ?? this.visible,
      groupMemberIds: a.groupMemberIds ?? [...this.groupMemberIds],
    });
    return g;
  }

  dragOffset(mousePagePos: Point, shapes: Map<string, Shape>): Point {
    const drawableShapes = getDrawableShapes(this, shapes);
    if (drawableShapes.length > 1) {
      return drawableShapes[0].dragOffset(mousePagePos);
    }
    return { x: mousePagePos.x, y: mousePagePos.y };
  }

  draw(): void {
    return;
  }

  getProps(): GroupProps {
    return {
      id: this.id,
      prevShapeId: this.prevShapeId,
      nextShapeId: this.nextShapeId,
      groupId: this.groupId,
      shapeType: this.shapeType,
      cursor: this.cursor,
      selectable: this.selectable,
      visible: this.visible,
      groupMemberIds: this.groupMemberIds,
    };
  }

  override highLightFrame(shapes: Map<string, Shape>): Shape[] {
    return groupHighlightFrame(this, shapes, this.boundingBox(shapes));
  }

  move(): Shape {
    return this;
  }

  override outlineShapes(shapes: Map<string, Shape>): Shape[] {
    return this.highLightFrame(shapes);
  }

  override selectFrame(shapes: Map<string, Shape>): Shape[] {
    const g = getTopLevelGroup(this, shapes);
    if (g) {
      return groupSelectFrame(g.boundingBox(shapes));
    }
    return [];
  }
}

const getGroupBoundingRect = (group: Group, shapes: Map<string, Shape>): Rect => {
  const boundingBoxes: Rect[] = [];
  const groupShapes = getShapeArrayFromIdArray(group.groupMemberIds, shapes);
  if (groupShapes.length === group.groupMemberIds.length) {
    for (const s of groupShapes) {
      if (s.shapeType === 'group') {
        boundingBoxes.push(getGroupBoundingRect(s as Group, shapes));
      } else {
        boundingBoxes.push(s.boundingBox());
      }
    }
  }
  return rectUnionArray(boundingBoxes);
};

const getTopLevelGroupFromId = (
  id: string,
  shapes: Map<string, Shape>
): Group | undefined => {
  const g = shapes.get(id);
  if (g && g.shapeType === 'group') {
    return getTopLevelGroup(g as Group, shapes);
  }
  return undefined;
};

const getTopLevelGroup = (group: Group, shapes: Map<string, Shape>): Group => {
  if (group.groupId === '') {
    return group;
  }
  const g = shapes.get(group.groupId);
  if (g && g.shapeType === 'group') {
    return getTopLevelGroup(g as Group, shapes);
  }
  return group;
};

const getDrawableShapeIds = (group: Group, shapes: Map<string, Shape>): string[] => {
  let shapeIds: string[] = [];
  for (const id of group.groupMemberIds) {
    const s = shapes.get(id);
    if (s) {
      if (s.shapeType === 'group') {
        shapeIds = [...shapeIds, ...getDrawableShapeIds(s as Group, shapes)];
      } else {
        shapeIds.push(id);
      }
    }
  }
  return shapeIds;
};

const getDrawableShapes = (group: Group, shapes: Map<string, Shape>): Shape[] => {
  let result: Shape[] = [];
  for (const id of group.groupMemberIds) {
    const s = shapes.get(id);
    if (s) {
      if (s.shapeType === 'group') {
        result = [...result, ...getDrawableShapes(s as Group, shapes)];
      } else {
        result.push(s);
      }
    }
  }
  return result;
};

const getAllShapeIds = (group: Group, shapes: Map<string, Shape>): string[] => {
  let shapeIds: string[] = [];
  for (const id of group.groupMemberIds) {
    const s = shapes.get(id);
    if (s) {
      if (s.shapeType === 'group') {
        shapeIds.push(s.id);
        shapeIds = [...shapeIds, ...getAllShapeIds(s as Group, shapes)];
      } else {
        shapeIds.push(id);
      }
    }
  }
  return shapeIds;
};

const getAllShapes = (group: Group, shapes: Map<string, Shape>): Shape[] => {
  let result: Shape[] = [];
  for (const id of group.groupMemberIds) {
    const s = shapes.get(id);
    if (s) {
      result.push(s);
      if (s.shapeType === 'group') {
        result = [...result, ...getAllShapes(s as Group, shapes)];
      }
    }
  }
  return result;
};
