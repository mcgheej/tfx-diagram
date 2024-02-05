import { createFeature } from '@ngrx/store';
import { transformFeatureKey } from '@tfx-diagram/electron-renderer-web-context-bridge-api';
import { transformReducer } from './transform.reducer';

export const transformFeature = createFeature({
  name: transformFeatureKey,
  reducer: transformReducer,
});

export const {
  name,
  reducer,
  selectTransformState,
  selectPageViewport,
  selectPageWindow,
  selectPageSize,
  selectViewportMouseCoords,
  selectTransform,
} = transformFeature;
