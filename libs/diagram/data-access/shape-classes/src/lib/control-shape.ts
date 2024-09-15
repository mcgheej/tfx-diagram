import {
  ShapeInspectorData,
  Transform,
} from '@tfx-diagram/electron-renderer-web/shared-types';
import { Connection } from './connections/connection';
import { Shape } from './shape-hierarchy/shape';

export abstract class ControlShape extends Shape {
  attachBoundary(): Connection | undefined {
    return undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  drawShadow(s: CanvasRenderingContext2D, t: Transform): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  highLightFrame(shapes: Map<string, Shape>): Shape[] {
    return [];
  }

  inspectorViewData(): ShapeInspectorData[] {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  outlineShapes(shapes: Map<string, Shape>): Shape[] {
    return [];
  }

  resizeToBox(): Shape {
    return this.copy({});
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  selectFrame(shapes: Map<string, Shape>): Shape[] {
    return [];
  }

  text(): string {
    return '';
  }

  override category(): string {
    return 'control-shape';
  }
}
