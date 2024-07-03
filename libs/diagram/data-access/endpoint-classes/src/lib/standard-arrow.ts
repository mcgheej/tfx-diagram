import { Endpoint, EndpointSizes } from '@tfx-diagram/diagram-data-access-shape-base-class';
import {
  pointAdd,
  pointRotate,
  pointScale,
  pointTransform,
} from '@tfx-diagram/diagram/util/misc-functions';
import { Point, Transform } from '@tfx-diagram/electron-renderer-web/shared-types';
import {
  arrowRatioHeight,
  arrowRatioLength,
  mmArrowLengths,
  mmBaseLineWidth,
} from './endpoint-styles';

export class StandardArrow extends Endpoint {
  static readonly availableSizesStandardArrow: EndpointSizes[] = ['medium', 'large'];
  static modalStartSize: EndpointSizes = 'medium';
  static modalFinishSize: EndpointSizes = 'medium';

  get modalStartSize(): EndpointSizes {
    return StandardArrow.modalStartSize;
  }

  set modalStartSize(size: EndpointSizes) {
    if (StandardArrow.availableSizesStandardArrow.includes(size)) {
      StandardArrow.modalStartSize = size;
    }
  }

  get modalFinishSize(): EndpointSizes {
    return StandardArrow.modalFinishSize;
  }

  set modalFinishSize(size: EndpointSizes) {
    if (StandardArrow.availableSizesStandardArrow.includes(size)) {
      StandardArrow.modalFinishSize = size;
    }
  }

  private mmLength: number;
  private mmHeight: number;
  private arrowBase: Point[];

  constructor(size: EndpointSizes = 'medium') {
    if (StandardArrow.availableSizesStandardArrow.includes(size)) {
      super('standard-arrow', size, StandardArrow.availableSizesStandardArrow);
    } else {
      super('standard-arrow', 'medium', StandardArrow.availableSizesStandardArrow);
    }
    this.mmLength = mmArrowLengths[size as 'medium' | 'large'];
    this.mmHeight = (2 * this.mmLength * arrowRatioHeight) / arrowRatioLength;
    this.arrowBase = [
      { x: 0, y: 0 },
      { x: this.mmLength, y: -this.mmHeight / 2 },
      { x: this.mmLength, y: this.mmHeight / 2 },
    ];
  }

  copy(): StandardArrow {
    return new StandardArrow(this.size);
  }

  /**
   *
   * @param p  - position of connector end
   * @param angle - angle in radians from x axis clockwise
   * @param strokeStyle
   * @param mmLineWidth
   * @param c
   * @param t
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
