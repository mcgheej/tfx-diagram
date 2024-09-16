import { Point } from '@tfx-diagram/electron-renderer-web/shared-types';

/**
 * index:             numeric id for line
 * shortestDistance:  shortest distance so far from point to line
 * k:                 parameteric value for connection point on line
 * connectionPoint:   (x, y) coords for connection point on line
 */
export interface LineAttachParams {
  index: number;
  shortestDistance: number;
  k: number;
  connectionPoint: Point;
}
