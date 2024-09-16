import { Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { RectSides } from '@tfx-diagram/shared-angular/utils/shared-types';

export interface RectangleAttachParams {
  side: RectSides;
  shortestDistance: number;
  position: number; // [0..1]
  newP: Point;
}
