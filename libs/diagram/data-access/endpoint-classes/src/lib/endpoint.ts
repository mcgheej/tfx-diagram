import { Point, Transform } from '@tfx-diagram/electron-renderer-web/shared-types';
import { EndpointSizes, EndpointStyles } from './endpoint-styles';

export abstract class Endpoint {
  endpointType: EndpointStyles = 'none';
  size: EndpointSizes;
  readonly availableSizes: EndpointSizes[];

  abstract get modalStartSize(): EndpointSizes;
  abstract set modalStartSize(size: EndpointSizes);
  abstract get modalFinishSize(): EndpointSizes;
  abstract set modalFinishSize(size: EndpointSizes);

  constructor(size: EndpointSizes, availableSizes: EndpointSizes[]) {
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
