import {
  pointAdd,
  pointRotate,
  pointScale,
  pointTransform,
} from '@tfx-diagram/diagram/util/misc-functions';
import { Point, Transform } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Endpoint } from './endpoint';

const arrowRatioHeight = 5;
const arrowRatioLength = 16;
const mmBaseLineWidth = 0.25;

// Baseline arrow head
const mmLength = 3;
const mmHeight = (2 * mmLength * arrowRatioHeight) / arrowRatioLength;
const arrowBase: Point[] = [
  { x: 0, y: 0 },
  { x: mmLength, y: -mmHeight / 2 },
  { x: mmLength, y: mmHeight / 2 },
];

export class StandardArrow extends Endpoint {
  constructor() {
    super();
    this.endpointType = 'standard-arrow';
  }

  copy(): StandardArrow {
    return new StandardArrow();
  }

  draw(
    p: Point,
    angle: number,
    strokeStyle: string,
    mmLineWidth: number,
    c: CanvasRenderingContext2D,
    t: Transform
  ): void {
    // Scale for line width
    const s = (1 + mmLineWidth / mmBaseLineWidth) / 2;

    const a: Point[] = [
      pointTransform(pointAdd(arrowBase[0], p), t),
      pointTransform(pointAdd(pointRotate(pointScale(arrowBase[1], s), angle), p), t),
      pointTransform(pointAdd(pointRotate(pointScale(arrowBase[2], s), angle), p), t),
    ];

    c.save();
    c.strokeStyle = strokeStyle;
    c.lineWidth = 1;
    c.fillStyle = strokeStyle;
    c.beginPath();
    c.moveTo(a[0].x, a[0].y);
    c.lineTo(a[1].x, a[1].y);
    c.lineTo(a[2].x, a[2].y);
    c.fill();
    c.restore();
  }
}
