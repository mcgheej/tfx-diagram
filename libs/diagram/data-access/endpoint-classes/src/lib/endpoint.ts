import { Point, Transform } from '@tfx-diagram/electron-renderer-web/shared-types';
import { EndpointStyles } from './endpoint-styles';

export abstract class Endpoint {
  endpointType: EndpointStyles = 'none';

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
