import { Endpoint, EndpointSize } from '@tfx-diagram/diagram/data-access/shape-classes';
import {
  pointAdd,
  pointRotate,
  pointScale,
  pointTransform,
} from '@tfx-diagram/diagram/util/misc-functions';
import { Point, Transform } from '@tfx-diagram/electron-renderer-web/shared-types';
import { arrowRatio, mmArrowLengths, mmBaseLineWidth } from './endpoint.constants';

export class HollowDiamond extends Endpoint {
  static readonly availableSizesHollowDiamond: EndpointSize[] = ['medium', 'large'];
  static modalStartSize: EndpointSize = 'medium';
  static modalFinishSize: EndpointSize = 'medium';

  get modalStartSize(): EndpointSize {
    return HollowDiamond.modalStartSize;
  }

  set modalStartSize(size: EndpointSize) {
    if (HollowDiamond.availableSizesHollowDiamond.includes(size)) {
      HollowDiamond.modalStartSize = size;
    }
  }

  get modalFinishSize(): EndpointSize {
    return HollowDiamond.modalFinishSize;
  }

  set modalFinishSize(size: EndpointSize) {
    if (HollowDiamond.availableSizesHollowDiamond.includes(size)) {
      HollowDiamond.modalFinishSize = size;
    }
  }

  private mmLength: number;
  private mmHeight: number;
  private arrowBase: Point[];

  constructor(size: EndpointSize = 'medium') {
    if (HollowDiamond.availableSizesHollowDiamond.includes(size)) {
      super('hollow-diamond', size, HollowDiamond.availableSizesHollowDiamond);
    } else {
      super('hollow-diamond', 'medium', HollowDiamond.availableSizesHollowDiamond);
    }

    this.mmLength = mmArrowLengths[this.size as 'medium' | 'large'];
    this.mmHeight = (2 * this.mmLength * arrowRatio.height) / arrowRatio.length;
    this.arrowBase = [
      { x: 0, y: 0 },
      { x: this.mmLength / 2, y: -this.mmHeight / 2 },
      { x: this.mmLength, y: 0 },
      { x: this.mmLength / 2, y: this.mmHeight / 2 },
    ];
  }

  copy(): HollowDiamond {
    return new HollowDiamond(this.size);
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

    const a: Point[] = [
      pointTransform(pointAdd(this.arrowBase[0], p), t),
      pointTransform(pointAdd(pointRotate(pointScale(this.arrowBase[1], s), angle), p), t),
      pointTransform(pointAdd(pointRotate(pointScale(this.arrowBase[2], s), angle), p), t),
      pointTransform(pointAdd(pointRotate(pointScale(this.arrowBase[3], s), angle), p), t),
    ];

    c.save();
    c.strokeStyle = strokeStyle;
    c.lineWidth = 1;
    c.fillStyle = 'white';
    c.beginPath();
    c.moveTo(a[0].x, a[0].y);
    c.lineTo(a[1].x, a[1].y);
    c.lineTo(a[2].x, a[2].y);
    c.lineTo(a[3].x, a[3].y);
    c.fill();

    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(a[0].x, a[0].y);
    c.lineTo(a[1].x, a[1].y);
    c.lineTo(a[2].x, a[2].y);
    c.lineTo(a[3].x, a[3].y);
    c.lineTo(a[0].x, a[0].y);
    c.clip();

    let pxLineWidth = mmLineWidth * t.scaleFactor * 2;
    if (pxLineWidth < 2) {
      pxLineWidth = 2;
    }
    c.lineWidth = pxLineWidth;
    c.setLineDash([]);
    c.beginPath();
    c.moveTo(a[0].x, a[0].y);
    c.lineTo(a[1].x, a[1].y);
    c.lineTo(a[2].x, a[2].y);
    c.lineTo(a[3].x, a[3].y);
    c.lineTo(a[0].x, a[0].y);
    c.stroke();

    c.restore();
  }
}
