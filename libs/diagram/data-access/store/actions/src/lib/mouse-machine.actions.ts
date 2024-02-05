import { createAction, props } from '@ngrx/store';
import { Point } from '@tfx-diagram/electron-renderer-web/shared-types';

export const highlightedShapeIdChange = createAction(
  '[Mouse Machine] Highlighted Shape ID Change',
  props<{ id: string }>()
);

export const doubleClick = createAction('[Mouse Machine] Double Click');

export const leftButtonDown = createAction(
  '[Mouse Machine] Left Button Down',
  props<{ x: number; y: number }>()
);

export const ctrlLeftButtonDown = createAction('[Mouse Machine] Ctrl Left Button Down');

export const dragStart = createAction(
  '[Mouse Moachine] Drag Start',
  props<{ mousePos: Point }>()
);

export const dragMove = createAction('[Mouse Machine] Drag Move', props<{ mousePos: Point }>());

export const dragEnd = createAction('[MouseMachine] Drag End');
