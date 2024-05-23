import { Store } from '@ngrx/store';
import { Point } from '@tfx-diagram/electron-renderer-web/shared-types';

export interface MouseMachineContext {
  mousePos: Point;
  shapeIdUnderMouse: string;
  highlightedShapeId: string;
  store: Store;
}
