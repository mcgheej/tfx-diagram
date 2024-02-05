import { Point, Size, Transform } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';

export const transformFeatureKey = 'transform';

export interface TransformState {
  pageViewport: Rect | null;
  pageWindow: Rect | null;
  pageSize: Size | null;
  viewportMouseCoords: Point;
  transform: Transform | null;
}
