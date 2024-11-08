import { LineSegment } from '@tfx-diagram/electron-renderer-web/shared-types';

export interface PathOperation {
  opCode: 'moveTo' | 'lineTo' | 'arcTo' | 'rect';
  params: number[];
}

export interface RectangleCornerArc {
  x: number;
  y: number;
  r: number;
}

export type RectangleSegment = RectangleCornerArc | LineSegment | undefined;
