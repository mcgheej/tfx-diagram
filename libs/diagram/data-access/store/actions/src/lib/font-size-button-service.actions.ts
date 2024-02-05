import { createAction, props } from '@ngrx/store';
import { FontProps } from '@tfx-diagram/electron-renderer-web/shared-types';

export const fontSizeDialogOpening = createAction(
  '[FontSizeButtonService] Font Size Dialog Opening'
);

export const fontSizeDialogClosed = createAction(
  '[FontSizeButtonService] Font Size Dialog Closed'
);

export const fontPropsChange = createAction(
  '[FontSizeButtonService] Font Props Change',
  props<{ props: Partial<FontProps> }>()
);
