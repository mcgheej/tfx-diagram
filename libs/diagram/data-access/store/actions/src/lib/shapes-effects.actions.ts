import { createAction, props } from '@ngrx/store';
import { Shape } from '@tfx-diagram/diagram/data-access/shape-classes';

export const firstShapeOnPage = createAction(
  '[Shapes Effects] First Shape On Page',
  props<{ shape: Shape; pageId: string }>(),
);

export const anotherShapeOnPage = createAction(
  '[Shapes Effects] Another Shape On Page',
  props<{ shapes: Shape[]; pageId: string }>(),
);

export const duplicatedShapesOnPage = createAction(
  '[Shapes Effects] Duplicate Shapes On Page',
  props<{ newShapeIds: string[]; shapes: Shape[]; pageId: string }>(),
);

export const PASTE_SHAPES_ON_PAGE = '[Shapes Effects] Paste Shapes On Page';
export const pasteShapesOnPage = createAction(
  PASTE_SHAPES_ON_PAGE,
  props<{ newShapeIds: string[]; shapes: Shape[]; pageId: string; pasteCount: number }>(),
);

export const deleteShapesOnPage = createAction(
  '[Shapes Effects] Delete Shapes On Page',
  props<{
    deletedShapeIds: string[];
    deletedConnectionIds: string[];
    modifiedShapes: Shape[];
    pageId: string;
    firstShapeId: string;
    lastShapeId: string;
  }>(),
);

export const ALIGN_OBJECTS = '[Shapes Effects] Align Objects';
export const alignObjects = createAction(
  ALIGN_OBJECTS,
  props<{
    selectedShapeIds: string[];
    shapes: Shape[];
    compromisedConnectionIds: string[];
  }>(),
);

export const distributeObjects = createAction(
  '[Shapes Effects] Distribute Objects',
  props<{ selectedShapeIds: string[]; shapes: Shape[] }>(),
);

export const bringToFront = createAction(
  '[Shapes Effects] Bring To front',
  props<{
    shapes: Shape[];
    pageId: string;
    firstShapeId: string;
    lastShapeId: string;
  }>(),
);

export const sendToBack = createAction(
  '[Shapes Effects] Send to Back',
  props<{
    shapes: Shape[];
    pageId: string;
    firstShapeId: string;
    lastShapeId: string;
  }>(),
);

export const bringItemForward = createAction(
  '[Shapes Effects] Bring Item Forward',
  props<{
    shapes: Shape[];
    pageId: string;
    firstShapeId: string;
    lastShapeId: string;
  }>(),
);

export const sendItemBackward = createAction(
  '[Shapes Effects] Send Item Backward',
  props<{
    shapes: Shape[];
    pageId: string;
    firstShapeId: string;
    lastShapeId: string;
  }>(),
);

export const textInsertPositionChange = createAction(
  '[Shapes Effects] Text Insert Position Change',
  props<{ newInsertPosition: number }>(),
);

export const shapeResizeClick = createAction(
  '[Shapes Effects] Shape Resize Click',
  props<{ selectedShapeIds: string[]; shapes: Shape[] }>(),
);

export const groupClick = createAction(
  '[Shapes Effects] Group Click',
  props<{
    selectedShapeIds: string[];
    shapes: Shape[];
    pageId: string;
    firstShapeId: string;
    lastShapeId: string;
  }>(),
);

export const ungroupClick = createAction(
  '[Shapes Effects] Ungroup Click',
  props<{ selectedShapeIds: string[]; deletedGroupIds: string[]; shapes: Shape[] }>(),
);
