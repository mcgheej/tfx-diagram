import { Endpoint, EndpointSize } from '@tfx-diagram/diagram/data-access/shape-classes';
import {
  pointAdd,
  pointRotate,
  pointScale,
  pointTransform,
} from '@tfx-diagram/diagram/util/misc-functions';
import { Point, Transform } from '@tfx-diagram/electron-renderer-web/shared-types';
import { arrowRatio, mmArrowLengths, mmBaseLineWidth } from './endpoint.constants';

export class SolidDiamond extends Endpoint {
  static readonly availableSizesSolidDiamond: EndpointSize[] = ['medium', 'large'];
  static modalStartSize: EndpointSize = 'medium';
  static modalFinishSize: EndpointSize = 'medium';

  get modalStartSize(): EndpointSize {
    return SolidDiamond.modalStartSize;
  }

  set modalStartSize(size: EndpointSize) {
    if (SolidDiamond.availableSizesSolidDiamond.includes(size)) {
      SolidDiamond.modalStartSize = size;
    }
  }

  get modalFinishSize(): EndpointSize {
    return SolidDiamond.modalFinishSize;
  }

  set modalFinishSize(size: EndpointSize) {
    if (SolidDiamond.availableSizesSolidDiamond.includes(size)) {
      SolidDiamond.modalFinishSize = size;
    }
  }

  private mmLength: number;
  private mmHeight: number;
  private arrowBase: Point[];

  constructor(size: EndpointSize = 'medium') {
    if (SolidDiamond.availableSizesSolidDiamond.includes(size)) {
      super('solid-diamond', size, SolidDiamond.availableSizesSolidDiamond);
    } else {
      super('solid-diamond', 'medium', SolidDiamond.availableSizesSolidDiamond);
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

  copy(): SolidDiamond {
    return new SolidDiamond(this.size);
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
    c.fillStyle = strokeStyle;
    c.beginPath();
    c.moveTo(a[0].x, a[0].y);
    c.lineTo(a[1].x, a[1].y);
    c.lineTo(a[2].x, a[2].y);
    c.lineTo(a[3].x, a[3].y);
    c.fill();
    c.restore();
  }
}
