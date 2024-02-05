/* eslint-disable @typescript-eslint/ban-types */

import { Point } from '@tfx-diagram/electron-renderer-web/shared-types';

export interface MouseMachineContext {
  mousePos: Point;
  shapeIdUnderMouse: string;
  highlightedShapeId: string;
}

export interface MouseMachineSchema {
  states: {
    roam: {};
    dragPending: {};
    drag: {};
  };
}
