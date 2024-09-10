import { Connection, Shape } from '@tfx-diagram/diagram/data-access/shape-classes';
import { TextEdit } from '@tfx-diagram/diagram/data-access/text-classes';
import { Point } from '@tfx-diagram/electron-renderer-web/shared-types';

export const controlFrameFeatureKey = 'controlFrame';

export type DragType =
  | 'none'
  | 'selection-box'
  | 'single-selection'
  | 'multi-selection'
  | 'handle';

export interface ControlFrameState {
  highlightedShapeId: string;
  highlightFrameStart: string;
  selectedShapeIds: string[];
  selectionFrameStart: string;
  controlShapes: Map<string, Shape>;
  dragType: 'none' | 'selection-box' | 'single-selection' | 'multi-selection' | 'handle';
  dragOffset: Point;
  selectionBoxAnchor: Point;
  textEdit: TextEdit | null;
  textCursorPosition: Point | null;
  connectionHook: Connection | null;
}
