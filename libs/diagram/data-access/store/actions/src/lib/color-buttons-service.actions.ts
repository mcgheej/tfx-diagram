import { createAction, props } from '@ngrx/store';
import { ColorRef, FontProps } from '@tfx-diagram/electron-renderer-web/shared-types';

export const colorDialogOpening = createAction('[ColorButtonsService] Color Dialog Opening');

export const colorDialogClosed = createAction('[ColorButtonsService] Color Dialog Closed');

export const LINE_COLOR_CHANGE = '[ColorButtonsService] Line Color Change';
export const lineColorChange = createAction(
  LINE_COLOR_CHANGE,
  props<{ lineColor: ColorRef }>()
);

export const FILL_COLOR_CHANGE = '[ColorButtonsService] Fill Color Change';
export const fillColorChange = createAction(
  FILL_COLOR_CHANGE,
  props<{ fillColor: ColorRef }>()
);

export const FONT_PROPS_CHANGE = '[ColorButtonsService] Font Props Change';
export const fontPropsChange = createAction(
  FONT_PROPS_CHANGE,
  props<{ props: Partial<FontProps> }>()
);
