import { createAction, props } from '@ngrx/store';
import {
  ObjectAlignment,
  ObjectDistribution,
  ShapeResizeOptions,
} from '@tfx-diagram/electron-renderer-web/shared-types';

export const alignObjectsClick = createAction(
  '[Arrange Menu] Object Alignment Click',
  props<{ value: ObjectAlignment; selectedShapeIds: string[] }>()
);

export const distributeObjectsClick = createAction(
  '[Arrange Menu] Distribute Objects Click',
  props<{ value: ObjectDistribution; selectedShapeIds: string[] }>()
);

export const bringToFrontClick = createAction(
  '[Arrange Menu] Bring to Front Click',
  props<{ selectedShapeIds: string[] }>()
);

export const sendToBackClick = createAction(
  '[Arrange Menu] Send to Back Click',
  props<{ selectedShapeIds: string[] }>()
);

export const bringItemForward = createAction(
  '[Arrange Menu] Bring Item Forward',
  props<{ selectedShapeId: string }>()
);

export const sendItemBackward = createAction(
  '[Arrange Menu] Send Item Backward',
  props<{ selectedShapeId: string }>()
);
export const shapeResizeClick = createAction(
  '[Arrange Menu] Shape Resize Click',
  props<{ selectedShapeIds: string[]; resizeOption: ShapeResizeOptions }>()
);

export const groupClick = createAction(
  '[Arrange Menu] Group Click',
  props<{ selectedShapeIds: string[] }>()
);

export const ungroupClick = createAction(
  '[Arrange Menu] Ungroup Click',
  props<{ selectedShapeIds: string[] }>()
);
