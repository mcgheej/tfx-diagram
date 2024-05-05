import { createSelector } from '@ngrx/store';
import { selectMousePositionCoordsType } from '@tfx-diagram/diagram-data-access-store-features-settings';
import {
  selectTransform,
  selectViewportMouseCoords,
} from '@tfx-diagram/diagram-data-access-store-features-transform';
import { inverseTransform } from '@tfx-diagram/diagram/util/misc-functions';

export const selectMousePositionAndFormat = createSelector(
  selectMousePositionCoordsType,
  selectViewportMouseCoords,
  selectTransform,
  (coordsType, viewportCoords, transform) => {
    if (coordsType === 'page' && transform) {
      return {
        coords: inverseTransform(viewportCoords, transform),
        format: '1.1-1',
        units: 'mm',
      };
    }
    return {
      coords: viewportCoords,
      format: '1.0-0',
      units: 'px',
    };
  }
);
