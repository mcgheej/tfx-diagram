import {
  pointAdd,
  pointRotate,
  pointTransform,
} from '@tfx-diagram/diagram/util/misc-functions';
import { Point, Transform } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Endpoint } from './endpoint';
import { EndpointSizes, mmBaseLineWidth, mmRadii } from './endpoint-styles';

export class HollowCircle extends Endpoint {
  static readonly availableSizesHollowCircle: EndpointSizes[] = ['small', 'medium', 'large'];
  static modalStartSize: EndpointSizes = 'medium';
  static modalFinishSize: EndpointSizes = 'medium';

  get modalStartSize(): EndpointSizes {
    return HollowCircle.modalStartSize;
  }

  set modalStartSize(size: EndpointSizes) {
    if (HollowCircle.availableSizesHollowCircle.includes(size)) {
      HollowCircle.modalStartSize = size;
    }
  }

  get modalFinishSize(): EndpointSizes {
    return HollowCircle.modalFinishSize;
  }

  set modalFinishSize(size: EndpointSizes) {
    if (HollowCircle.availableSizesHollowCircle.includes(size)) {
      HollowCircle.modalFinishSize = size;
    }
  }

  private mmCircleRadius: number;

  constructor(size: EndpointSizes) {
    if (HollowCircle.availableSizesHollowCircle.includes(size)) {
      super('hollow-circle', size, HollowCircle.availableSizesHollowCircle);
    } else {
      super('hollow-circle', 'medium', HollowCircle.availableSizesHollowCircle);
    }
    this.mmCircleRadius = mmRadii[size];
  }

  copy(): HollowCircle {
    return new HollowCircle(this.size);
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
    const pxE = pointTransform(p, t);
    const { x, y } = pointAdd(pointRotate({ x: pxRadius, y: 0 }, angle), pxE);

    c.save();
    c.fillStyle = 'white';
    c.beginPath();
    c.arc(x, y, pxRadius, 0, 2 * Math.PI);
    c.fill();

    c.strokeStyle = strokeStyle;
    c.lineWidth = 1;
    c.beginPath();
    c.arc(x, y, pxRadius, 0, 2 * Math.PI);
    c.clip();

    let pxLineWidth = mmLineWidth * t.scaleFactor * 2;
    if (pxLineWidth < 2) {
      pxLineWidth = 2;
    }
    c.lineWidth = pxLineWidth;
    c.setLineDash([]);
    c.beginPath();
    c.arc(x, y, pxRadius, 0, 2 * Math.PI);
    c.stroke();
    c.restore();
  }
}
