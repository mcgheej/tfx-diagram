import { pointTransform } from '@tfx-diagram/diagram/util/misc-functions';
import { Point, Transform } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Endpoint } from './endpoint';

const mmBaseLineWidth = 0.25;

export abstract class SolidCircle extends Endpoint {
  constructor(private mmCircleRadius: number) {
    super();
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
    const pxRadius = this.mmCircleRadius * s * t.scaleFactor;
    const { x, y } = pointTransform(p, t);

    c.save();
    c.fillStyle = strokeStyle;
    c.beginPath();
    c.arc(x, y, pxRadius, 0, 2 * Math.PI);
    c.fill();
    c.restore();
  }
}
