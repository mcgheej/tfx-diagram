import { pointTransform } from '@tfx-diagram/diagram/util/misc-functions';
import { Point, Transform } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Endpoint } from '../endpoint';
import { mmBaseLineWidth, mmRadii } from '../endpoint.constants';
import { EndpointSize } from '../endpoint.types';

export class HalfCircle extends Endpoint {
  static readonly availableSizesHalfCircle: EndpointSize[] = ['small', 'medium', 'large'];
  static modalStartSize: EndpointSize = 'medium';
  static modalFinishSize: EndpointSize = 'medium';

  get modalStartSize(): EndpointSize {
    return HalfCircle.modalStartSize;
  }

  set modalStartSize(size: EndpointSize) {
    if (HalfCircle.availableSizesHalfCircle.includes(size)) {
      HalfCircle.modalStartSize = size;
    }
  }

  get modalFinishSize(): EndpointSize {
    return HalfCircle.modalFinishSize;
  }

  set modalFinishSize(size: EndpointSize) {
    if (HalfCircle.availableSizesHalfCircle.includes(size)) {
      HalfCircle.modalFinishSize = size;
    }
  }

  private mmCircleRadius: number;

  constructor(size: EndpointSize) {
    if (HalfCircle.availableSizesHalfCircle.includes(size)) {
      super('half-circle', size, HalfCircle.availableSizesHalfCircle);
    } else {
      super('half-circle', 'medium', HalfCircle.availableSizesHalfCircle);
    }
    this.mmCircleRadius = mmRadii[this.size];
  }

  copy(): HalfCircle {
    return new HalfCircle(this.size);
  }

  /**
   * See base class (Endpoint) for parameter descriptions
   */
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
    const sAngle = (3 * Math.PI) / 2 + angle;
    const eAngle = Math.PI / 2 + angle;
    c.save();
    c.fillStyle = 'white';
    c.beginPath();
    c.arc(x, y, pxRadius, sAngle, eAngle);
    c.fill();

    c.strokeStyle = strokeStyle;
    c.lineWidth = 1;
    c.beginPath();
    c.arc(x, y, pxRadius, sAngle, eAngle);
    c.clip();

    let pxLineWidth = mmLineWidth * t.scaleFactor * 2;
    if (pxLineWidth < 2) {
      pxLineWidth = 2;
    }
    c.lineWidth = pxLineWidth;
    c.setLineDash([]);
    c.beginPath();
    c.arc(x, y, pxRadius, sAngle, eAngle);
    c.stroke();

    c.restore();
  }
}
