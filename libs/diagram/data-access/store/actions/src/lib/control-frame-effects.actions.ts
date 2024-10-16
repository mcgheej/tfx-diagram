import { createAction, props } from '@ngrx/store';
import {
  Connection,
  Endpoint,
  RectangleOutline,
  Shape,
} from '@tfx-diagram/diagram/data-access/shape-classes';
import {
  ColorRef,
  FontProps,
  Point,
  TextBoxConfig,
} from '@tfx-diagram/electron-renderer-web/shared-types';

export const HIGHLIGHT_FRAME_CHANGE = '[Control Frame Effects] Highlight Frame Change';
export const highlightFrameChange = createAction(
  HIGHLIGHT_FRAME_CHANGE,
  props<{ frameShapes: Shape[] }>()
);

export const selectionChange = createAction(
  '[Control Frame Effects] Selection Change',
  props<{ selectedShapeIds: string[]; frameShapes: Shape[] }>()
);

// export const selectionFrameModify = createAction(
//   '[Control Frame Effects] Selection Frame Modify',
//   props<{ modifiedControlShapes: Shape[] }>()
// );

export const FRAME_CHANGE = '[Control Frame Effects] Frame Change';
export const frameChange = createAction(
  FRAME_CHANGE,
  props<{ modifiedShapes: Shape[] }>()
);

// export const dragStart = createAction('[Control Frame Effects] Drag Start');

export const dragStartSelectionBox = createAction(
  '[Control Frame Effects] Drag Start Selection Box',
  props<{ mousePagePos: Point; selectionBox: RectangleOutline }>()
);

export const dragMoveSelectionBox = createAction(
  '[Control Frame Effects] Drag Move Selection Box',
  props<{ selectionBox: RectangleOutline }>()
);

export const dragEndSelectionBox = createAction(
  '[Control Frame Effects] Drag End Selection Box',
  props<{ selectedShapeIds: string[]; controlFrame: Shape[] }>()
);

export const dragStartSingleSelection = createAction(
  '[Control Frame Effects] Drag Start Single Selection',
  props<{
    selectedShape: Shape;
    dragOffset: Point;
    frameShapes: Shape[];
    movingConnectionIds: string[];
    compromisedConnectionIds: string[];
  }>()
);

export const DRAG_MOVE_SINGLE_SELECTION =
  '[Control Frame Effects] Drag Move Single Selection';
export const dragMoveSingleSelection = createAction(
  DRAG_MOVE_SINGLE_SELECTION,
  props<{ controlShapes: Shape[]; shapes: Shape[]; modifiedConnections: Connection[] }>()
);

export const dragEndSingleSelection = createAction(
  '[Control Frame Effects] Drag End Single Selection',
  props<{ selectedShapeIds: string[]; frameShapes: Shape[] }>()
);

export const dragStartMultiSelection = createAction(
  '[Control Frame Effects] Drag Start Multi Selection',
  props<{
    selectedShapeIds: string[];
    dragOffset: Point;
    movingConnectionIds: string[];
  }>()
);

export const DRAG_MOVE_MULTI_SELECTION =
  '[Control Frame Effects] Drag Move Multi Selection';
export const dragMoveMultiSelection = createAction(
  DRAG_MOVE_MULTI_SELECTION,
  props<{ controlShapes: Shape[]; shapes: Shape[]; modifiedConnections: Connection[] }>()
);

export const DRAG_END_MULTI_SELECTION =
  '[Control Frame Effects] Drag End Multi Selection';
export const dragEndMultiSelection = createAction(DRAG_END_MULTI_SELECTION);

export const DRAG_START_HANDLE = '[Control Frame Effects] Drag Start Handle';
export const dragStartHandle = createAction(
  DRAG_START_HANDLE,
  props<{
    dragOffset: Point;
    controlShapes: Shape[];
    connectionHook: Connection | null;
    movingConnectionIds: string[];
  }>()
);

export const DRAG_MOVE_HANDLE = '[Control Frame Effects] Drag Move Handle';
export const dragMoveHandle = createAction(
  DRAG_MOVE_HANDLE,
  props<{
    controlShapes: Shape[];
    shapes: Shape[];
    connectionHook: Connection | null;
    modifiedConnections: Connection[];
  }>()
);

export const DRAG_END_HANDLE = '[Control Frame Effects] Drag End Handle';
export const dragEndHandle = createAction(
  DRAG_END_HANDLE,
  props<{ controlShapes: Shape[]; connectionHook: Connection | null }>()
);

export const LINE_COLOR_CHANGE = '[Control Frame Effects] Line Color Change';
export const lineColorChange = createAction(
  LINE_COLOR_CHANGE,
  props<{ lineColor: ColorRef }>()
);

export const FILL_COLOR_CHANGE = '[Control Frame Effects] Fill Color Change';
export const fillColorChange = createAction(
  FILL_COLOR_CHANGE,
  props<{ fillColor: ColorRef }>()
);

export const LINE_DASH_CHANGE = '[Control Frame Effects] Line Dash Change';
export const lineDashChange = createAction(
  LINE_DASH_CHANGE,
  props<{ lineDash: number[] }>()
);

export const LINE_WIDTH_CHANGE = '[Control Frame Effects] Line Width Change';
export const lineWidthChange = createAction(
  LINE_WIDTH_CHANGE,
  props<{ lineWidth: number }>()
);

export const START_ENDPOINT_CHANGE = '[Control Frame Effects] Start Endpoint Change';
export const startEndpointChange = createAction(
  START_ENDPOINT_CHANGE,
  props<{ endpoint: Endpoint | null }>()
);

export const FINISH_ENDPOINT_CHANGE = '[Control Frame Effects] Finish Endpoint Change';
export const finishEndpointChange = createAction(
  FINISH_ENDPOINT_CHANGE,
  props<{ endpoint: Endpoint | null }>()
);

export const FONT_PROPS_CHANGE = '[Control Frame Effects] Font Props Change';
export const fontPropsChange = createAction(
  FONT_PROPS_CHANGE,
  props<{ props: Partial<FontProps> }>()
);

export const SELECTED_SHAPES_LINE_COLOR_CHANGE =
  '[Control Frame Effects] Selected Shapes Line Color Change';
export const selectedShapesLineColorChange = createAction(
  SELECTED_SHAPES_LINE_COLOR_CHANGE,
  props<{ lineColor: ColorRef; selectedShapeIds: string[] }>()
);

export const SELECTED_SHAPES_FILL_COLOR_CHANGE =
  '[Control Frame Effects] Selected Shapes Fill Color Change';
export const selectedShapesFillColorChange = createAction(
  SELECTED_SHAPES_FILL_COLOR_CHANGE,
  props<{ fillColor: ColorRef; selectedShapeIds: string[] }>()
);

export const SELECTED_SHAPES_LINE_DASH_CHANGE =
  '[Control Frame Effects] Selected Shapes Line Dash Change';
export const selectedShapesLineDashChange = createAction(
  SELECTED_SHAPES_LINE_DASH_CHANGE,
  props<{ lineDash: number[]; selectedShapeIds: string[] }>()
);

export const SELECTED_SHAPES_LINE_WIDTH_CHANGE =
  '[Control Frame Effects] Selected Shapes Line Width Change';
export const selectedShapesLineWidthChange = createAction(
  SELECTED_SHAPES_LINE_WIDTH_CHANGE,
  props<{ lineWidth: number; selectedShapeIds: string[] }>()
);

export const SELECTED_SHAPES_START_ENDPOINT_CHANGE =
  '[Control Frame Effects] Selected Shapes Start Endpoint Change';
export const selectedShapesStartEndpointChange = createAction(
  SELECTED_SHAPES_START_ENDPOINT_CHANGE,
  props<{ endpoint: Endpoint | null; selectedShapeIds: string[] }>()
);

export const SELECTED_SHAPES_FINISH_ENDPOINT_CHANGE =
  '[Control Frame Effects] Selected Shapes Finish Endpoint Change';
export const selectedShapesFinishEndpointChange = createAction(
  SELECTED_SHAPES_FINISH_ENDPOINT_CHANGE,
  props<{ endpoint: Endpoint | null; selectedShapeIds: string[] }>()
);

export const SELECTED_SHAPES_FONT_PROPS_CHANGE =
  '[Control Frame Effects] Selected Shapes Font Props Change';
export const selectedShapesFontPropsChange = createAction(
  SELECTED_SHAPES_FONT_PROPS_CHANGE,
  props<{ props: Partial<FontProps>; selectedShapeIds: string[] }>()
);

export const SELECTED_SHAPE_TEXT_CONFIG_CHANGE =
  '[Control Frame Effects] Selected Shape Text Config Change';
export const selectedShapeTextConfigChange = createAction(
  SELECTED_SHAPE_TEXT_CONFIG_CHANGE,
  props<{ shapeId: string; textConfig: TextBoxConfig; newInsertPosition: number }>()
);

export const editTextChange = createAction(
  '[Control Frame Effects] Edit Text Change',
  props<{ shapeId: string }>()
);

export const editTextClick = createAction(
  '[Control Frame Effects] Edit Text Click',
  props<{ insertPosition: number }>()
);
