import { createAction, props } from '@ngrx/store';
import { Point } from '@tfx-diagram/electron-renderer-web/shared-types';

export const mouseMoveOnViewport = createAction(
  '[Diagram Canvas Directive] Mouse Move On Viewport',
  props<{ coords: Point }>()
);

export const textCursorPositionChange = createAction(
  '[Diagram Canvas Directive] Text Cursor Position Change',
  props<{ position: Point | null }>()
);
