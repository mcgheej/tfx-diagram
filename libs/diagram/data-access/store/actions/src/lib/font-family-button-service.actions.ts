import { createAction, props } from '@ngrx/store';
import { FontProps } from '@tfx-diagram/electron-renderer-web/shared-types';

export const fontFamilyDialogOpening = createAction(
  '[FontFamilyButtonService] Font Family Dialog Opening'
);

export const FontFamilyDialogClosed = createAction(
  '[FontFamilyButtonService] Font Family Dialog Closed'
);

export const fontPropsChange = createAction(
  '[FontFamilyButtonService] Font Props Change',
  props<{ props: Partial<FontProps> }>()
);
