import { createAction, props } from '@ngrx/store';
import { FontProps } from '@tfx-diagram/electron-renderer-web/shared-types';

export const fontPropsChange = createAction(
  '[Font Controls Component] Font Props Change',
  props<{ props: Partial<FontProps> }>()
);
