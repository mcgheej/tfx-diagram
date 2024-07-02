import { pointTransform } from '@tfx-diagram/diagram/util/misc-functions';
import { Point, Transform } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Endpoint } from './endpoint';
import { EndpointSizes } from './endpoint-styles';

const mmBaseLineWidth = 0.25;

const mmRadii = {
  small: 0.75,
  medium: 1,
  large: 1.5,
};

export class SolidCircle extends Endpoint {
  static readonly availableSizesSolidCircle: EndpointSizes[] = ['small', 'medium', 'large'];
  static modalStartSize: EndpointSizes = 'medium';
  static modalFinishSize: EndpointSizes = 'medium';

  get modalStartSize(): EndpointSizes {
    return SolidCircle.modalStartSize;
  }

  set modalStartSize(size: EndpointSizes) {
    if (SolidCircle.availableSizesSolidCircle.includes(size)) {
      SolidCircle.modalStartSize = size;
    }
  }

  get modalFinishSize(): EndpointSizes {
    return SolidCircle.modalFinishSize;
  }

  set modalFinishSize(size: EndpointSizes) {
    if (SolidCircle.availableSizesSolidCircle.includes(size)) {
      SolidCircle.modalFinishSize = size;
    }
  }

  private mmCircleRadius: number;

  constructor(size: EndpointSizes) {
    if (SolidCircle.availableSizesSolidCircle.includes(size)) {
      super(size, SolidCircle.availableSizesSolidCircle);
    } else {
      super('medium', SolidCircle.availableSizesSolidCircle);
    }
    this.endpointType = 'solid-circle';
    this.mmCircleRadius = mmRadii[size];
  }

  copy(): SolidCircle {
    return new SolidCircle(this.size);
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
