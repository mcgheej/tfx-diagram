import { createAction, props } from '@ngrx/store';
import {
  Arc,
  Circle,
  Curve,
  Line,
  Rectangle,
  Triangle,
} from '@tfx-diagram/diagram-data-access-shape-base-class';

export const INSERT_CIRCLE = '[Insert Menu] Insert Circle';
export const INSERT_RECTANGLE = '[Insert Menu] Insert Rectangle';
export const INSERT_ARC = '[Insert Menu] Insert Arc';
export const INSERT_CURVE = '[Insert Menu] Insert Curve';
export const INSERT_LINE = '[Insert Menu] Insert Line';
export const INSERT_TRIANGLE = '[Insert Menu] Insert Triangle';

export const insertCircle = createAction(INSERT_CIRCLE, props<{ shape: Circle }>());

export const insertRectangle = createAction(INSERT_RECTANGLE, props<{ shape: Rectangle }>());

export const insertArc = createAction(INSERT_ARC, props<{ shape: Arc }>());

export const insertCurve = createAction(INSERT_CURVE, props<{ shape: Curve }>());

export const insertLine = createAction(INSERT_LINE, props<{ shape: Line }>());

export const insertTriangle = createAction(INSERT_TRIANGLE, props<{ shape: Triangle }>());
