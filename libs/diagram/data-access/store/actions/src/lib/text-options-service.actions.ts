import { createAction, props } from '@ngrx/store';
import { FontProps } from '@tfx-diagram/electron-renderer-web/shared-types';

export const textOptionsDialogOpening = createAction(
  '[TextOptionsService] Text Options Dialog Opening'
);

export const textOptionsDialogClosed = createAction(
  '[TextOptionsService] Text Options Dialog Closed'
);

export const fontPropsChange = createAction(
  '[TextOptionsService] Font Props Change',
  props<{ props: Partial<FontProps> }>()
);
