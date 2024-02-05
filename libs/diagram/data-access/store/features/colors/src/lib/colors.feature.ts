import { createFeature } from '@ngrx/store';
import { colorsKey } from '@tfx-diagram/electron-renderer-web/ngrx-state-colors';
import { colorsReducer } from './colors.reducer';

export const colorsFeature = createFeature({
  name: colorsKey,
  reducer: colorsReducer,
});

export const {
  name,
  reducer,
  selectThemeColors,
  selectStandardColors,
  selectCustomColors,
  selectCustomColorIds,
  selectColorsState,
} = colorsFeature;
