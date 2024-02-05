import { createReducer, on } from '@ngrx/store';
import { SettingsEffectsActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { SettingsState } from '@tfx-diagram/electron-renderer-web-context-bridge-api';

export const initialState: SettingsState = {
  gridShow: true,
  gridSnap: false,
  gridSize: 5,
  shapeSnap: false,
  showRulers: true,
  screenPixelDensity: 127,
  pageAlignmentInViewport: { horizontal: 'center', vertical: 'center' },
  showMousePosition: false,
  mousePositionCoordsType: 'page',
  showShapeInspector: false,
  jpegQuality: 0.8,
};

export const settingsReducer = createReducer(
  initialState,
  on(SettingsEffectsActions.appStart, (state, { changes }) => {
    return {
      ...state,
      ...changes,
    };
  }),
  on(SettingsEffectsActions.jpegQualityChange, (state, { quality }) => {
    return {
      ...state,
      jpegQuality: quality,
    };
  }),
  on(SettingsEffectsActions.showRulersToggle, (state) => {
    return {
      ...state,
      showRulers: !state.showRulers,
    };
  }),
  on(SettingsEffectsActions.showShapeInspectorToggle, (state) => {
    return {
      ...state,
      showShapeInspector: !state.showShapeInspector,
    };
  }),
  on(SettingsEffectsActions.shapeSnapToggle, (state) => {
    return {
      ...state,
      shapeSnap: !state.shapeSnap,
    };
  }),
  on(SettingsEffectsActions.showMousePositionToggle, (state) => {
    return {
      ...state,
      showMousePosition: !state.showMousePosition,
    };
  }),
  on(SettingsEffectsActions.showGridToggle, (state) => {
    return {
      ...state,
      gridShow: !state.gridShow,
    };
  }),
  on(SettingsEffectsActions.snapToGridToggle, (state) => {
    return {
      ...state,
      gridSnap: !state.gridSnap,
    };
  }),
  on(SettingsEffectsActions.pageAlignmentChange, (state, { alignment }) => {
    return {
      ...state,
      pageAlignmentInViewport: alignment,
    };
  }),
  on(SettingsEffectsActions.screenPixelDensityChange, (state, { value }) => {
    return {
      ...state,
      screenPixelDensity: value,
    };
  }),
  on(SettingsEffectsActions.mousePositionCoordsTypeChange, (state, { value }) => {
    return {
      ...state,
      mousePositionCoordsType: value,
    };
  })
);
