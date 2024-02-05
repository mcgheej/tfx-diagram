import { createAction, props } from '@ngrx/store';

export const lineDashDialogOpening = createAction(
  '[LineDashButtonService] Line Dash Dialog Opening'
);

export const lineDashDialogClosed = createAction(
  '[LineDashButtonService] Line Dash Dialog Closed'
);

export const lineDashChange = createAction(
  '[LineDashButtonService] Line Dash Change',
  props<{ lineDash: number[] }>()
);
