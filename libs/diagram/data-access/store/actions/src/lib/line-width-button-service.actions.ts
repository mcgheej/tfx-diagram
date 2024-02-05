import { createAction, props } from '@ngrx/store';

export const lineWidthDialogOpening = createAction(
  '[LineWidthButtonService] Line Width Dialog Opening'
);

export const lineWidthDialogClosed = createAction(
  '[LineWidthButtonService] Line Width Dialog Closed'
);

export const lineWidthChange = createAction(
  '[LineWidthButtonService] LineWidth Change',
  props<{ lineWidth: number }>()
);
