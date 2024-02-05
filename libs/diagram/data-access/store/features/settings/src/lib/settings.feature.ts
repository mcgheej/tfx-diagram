import { createFeature, createSelector } from '@ngrx/store';
import { settingsFeatureKey } from '@tfx-diagram/electron-renderer-web-context-bridge-api';
import { GridProps } from '@tfx-diagram/electron-renderer-web/shared-types';
import { settingsReducer } from './settings.reducer';

export const settingsFeature = createFeature({
  name: settingsFeatureKey,
  reducer: settingsReducer,
});

export const {
  name,
  reducer,
  selectGridShow,
  selectGridSnap,
  selectGridSize,
  selectShapeSnap,
  selectShowRulers,
  selectScreenPixelDensity,
  selectPageAlignmentInViewport,
  selectShowMousePosition,
  selectMousePositionCoordsType,
  selectShowShapeInspector,
  selectJpegQuality,
} = settingsFeature;

export const selectGridProps = createSelector(
  selectGridShow,
  selectGridSnap,
  selectGridSize,
  (gridShow, gridSnap, gridSize) => {
    return { gridShow, gridSnap, gridSize } as GridProps;
  }
);
