import { PartPartial } from '@tfx-diagram/electron-renderer-web/shared-types';
import { ShapeCursors } from '../types/shape-cursors.type';
import { ShapeTypes } from '../types/shape-types.type';

/**
 * Base properties for all shape instances
 */
export interface ShapeProps {
  id: string;
  prevShapeId: string;
  nextShapeId: string;
  groupId: string;
  shapeType: ShapeTypes;
  cursor: ShapeCursors;
  selectable: boolean;
  visible: boolean;
}

/**
 * The ShapeConfig type is derived from the ShapeProps interface.
 * All objects of type ShapeConfig must contain properties for
 * 'id', 'shapeType' and 'cursor'. All other properties derived
 * from ShapeProps are optional.
 */
export type ShapeConfig = PartPartial<ShapeProps, 'id' | 'shapeType' | 'cursor'>;
