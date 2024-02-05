import { createAction, props } from '@ngrx/store';
import { Color } from '@tfx-diagram/shared-angular/utils/shared-types';

export const customColorAdd = createAction(
  '[ColorDialogComponent] Custom Color Add',
  props<{ newColor: Color }>()
);
