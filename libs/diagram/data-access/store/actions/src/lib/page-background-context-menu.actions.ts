import { createAction, props } from '@ngrx/store';
import {
  Arc,
  Circle,
  Curve,
  Line,
  Rectangle,
  Triangle,
} from '@tfx-diagram/diagram/data-access/shape-classes';
import { TextEdit } from '@tfx-diagram/diagram/data-access/text-classes';
import { Point } from '@tfx-diagram/electron-renderer-web/shared-types';

export const INSERT_CIRCLE = '[Page Background Context Menu] Insert Circle';
export const INSERT_RECTANGLE = '[Page Background Context Menu] Insert Rectangle';
export const INSERT_ARC = '[Page Background Context Menu] Insert Arc';
export const INSERT_CURVE = '[Page Background Context Menu] Insert Curve';
export const INSERT_LINE = '[Page Background Context Menu] Insert Line';
export const INSERT_TRIANGLE = '[Page Background Context Menu] Insert Triangle';
export const PASTE_CLICK = '[Page Background Context Menu] Paste Click';

export const insertCircle = createAction(INSERT_CIRCLE, props<{ shape: Circle }>());

export const insertRectangle = createAction(INSERT_RECTANGLE, props<{ shape: Rectangle }>());

export const insertArc = createAction(INSERT_ARC, props<{ shape: Arc }>());

export const insertCurve = createAction(INSERT_CURVE, props<{ shape: Curve }>());

export const insertLine = createAction(INSERT_LINE, props<{ shape: Line }>());

export const insertTriangle = createAction(INSERT_TRIANGLE, props<{ shape: Triangle }>());

export const pasteClick = createAction(
  PASTE_CLICK,
  props<{ textEdit: TextEdit | null; position: Point }>()
);
