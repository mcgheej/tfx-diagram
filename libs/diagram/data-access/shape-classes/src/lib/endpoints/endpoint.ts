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

  /**
   *
   * @param p - Position of connector end on page (coordinates in millimeters)
   * @param angle - Direction of connector at end point in radians, clockwise from
   *                3 o'clock
   * @param strokeStyle - Colour of endpoint defined using 6 digit hex number
   *                      (with leading #)
   * @param mmLineWidth - Width of connector in millimeters
   * @param c - Rendering context for canvas
   * @param t - Drawing transform for current page (translation and scaling)
   */
  abstract draw(
    p: Point,
    angle: number,
    strokeStyle: string,
    mmLineWidth: number,
    c: CanvasRenderingContext2D,
    t: Transform
  ): void;
}
