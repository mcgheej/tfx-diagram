import { Point, Transform } from '@tfx-diagram/electron-renderer-web/shared-types';
import { EndpointSize, EndpointStyle } from './endpoint-styles';

export abstract class Endpoint {
  readonly availableSizes: EndpointSize[];
  endpointType: EndpointStyle;
  size: EndpointSize;

  abstract get modalStartSize(): EndpointSize;
  abstract set modalStartSize(size: EndpointSize);
  abstract get modalFinishSize(): EndpointSize;
  abstract set modalFinishSize(size: EndpointSize);

  constructor(endpointType: EndpointStyle, size: EndpointSize, availableSizes: EndpointSize[]) {
    this.endpointType = endpointType;
    this.size = size;
    this.availableSizes = availableSizes;
  }

  abstract copy(): Endpoint;
  abstract draw(
    p: Point,
    angle: number,
    strokeStyle: string,
    mmLineWidth: number,
    c: CanvasRenderingContext2D,
    t: Transform
  ): void;
}
