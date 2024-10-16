import {
  ShapeInspectorData,
  Transform,
} from '@tfx-diagram/electron-renderer-web/shared-types';
import { Connection } from '../../connections/connection';
import { ShapeCategory } from '../../types';
import { Shape } from '../shape';

export abstract class StructuralShape extends Shape {
  attachBoundary(): Connection | undefined {
    return undefined;
  }

  draw(): void {
    return;
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

  override category(): ShapeCategory {
    return 'structural-shape';
  }
}
