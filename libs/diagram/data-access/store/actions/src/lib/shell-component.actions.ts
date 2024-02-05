import { createAction, props } from '@ngrx/store';

export const appStart = createAction('[Shell Component] App Start');

export const exportJpegClick = createAction('[Shell Component] Export JPEG Click');

export const exportJpegConfirmed = createAction(
  '[Shell Component] Export JPEG Confirmed',
  props<{ data: string; quality: number }>()
);

export const exportJpegCancel = createAction(
  '[Shell Component] Export JPEG Cancel',
  props<{ quality: number }>()
);
