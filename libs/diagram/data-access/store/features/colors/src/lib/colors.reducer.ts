import { createReducer, on } from '@ngrx/store';
import { ColorDialogComponentActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { ColorsState } from '@tfx-diagram/electron-renderer-web/ngrx-state-colors';
import { nanoid } from 'nanoid';
import { defaultTheme } from './default-theme';
import { standardColors } from './standard-colors';

export const initialState: ColorsState = {
  themeColors: defaultTheme(),
  standardColors: standardColors(),
  customColors: {},
  customColorIds: [],
};

export const colorsReducer = createReducer(
  initialState,
  on(ColorDialogComponentActions.customColorAdd, (state, { newColor }) => {
    const newCustomColors = { ...state.customColors };
    const id = nanoid();
    newCustomColors[id] = newColor;
    return {
      ...state,
      customColors: newCustomColors,
      customColorIds: [...state.customColorIds, id],
    };
  })
);
