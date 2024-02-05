import { Shape } from '@tfx-diagram/diagram-data-access-shape-base-class';
import { GridProps, Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Handle } from '../../../control-shapes/handle';
import { LineOutline } from '../../../control-shapes/line-outline';
import { gridSnapPoint } from '../../../misc-functions';
import { Reshaper } from '../../../reshaper';
import { Triangle } from '../triangle';

export class TriangleControlPointReshaper extends Reshaper {
  modifiedShape(
    newHandlePos: Point,
    associatedShape: Shape,
    gridProps: GridProps,
    handle: Handle,
    controlFrame: Shape[]
  ): Shape {
    const associatedTriangle = associatedShape as Triangle;
    const newPos = gridSnapPoint(newHandlePos, gridProps);
    return associatedTriangle.copy({
      vertices: this.reshape(newPos, associatedTriangle, handle, controlFrame),
    });
  }

  modifiedControlFrame(shape: Shape, controlFrame: Shape[], handle: Handle): Shape[] {
    return this.modify((shape as Triangle).vertices, handle, controlFrame);
  }

  modifiedFrameForDrag(controlFrame: Shape[]): Shape[] {
    if (controlFrame.length !== 6) {
      return [];
    }
    const modifiedShapes: Shape[] = [];
    for (let i = 3; i < 6; i++) {
      modifiedShapes.push(controlFrame[i].copy({ visible: false }));
    }
    return modifiedShapes;
  }

  private reshape(
    newHandlePos: Point,
    triangle: Triangle,
    handle: Handle,
    controlFrame: Shape[]
  ): [Point, Point, Point] {
    const handleIdx = this.findHandleIndex(handle.id, controlFrame);
    if (handleIdx < 3 || handleIdx > 5) {
      return triangle.vertices;
    }
    const v: [Point, Point, Point] = [
      triangle.vertices[0],
      triangle.vertices[1],
      triangle.vertices[2],
    ];
    v[handleIdx % 3] = newHandlePos;
    return v;
  }

  private modify(
    vertices: [Point, Point, Point],
    handle: Handle,
    controlFrame: Shape[]
  ): Shape[] {
    // Het index of handle shape in control frame - will be between 3 and 5.
    const h = this.findHandleIndex(handle.id, controlFrame);
    if (h < 3 || h > 5) {
      return [];
    }

    // Get indexes for lines on either side of handle
    const l1 = (h + 3) % 3;
    const l2 = (h + 5) % 3;

    // Get modified line outlines and handle
    const modifiedShapes: Shape[] = [
      (controlFrame[l1] as LineOutline).copy({
        controlPoints: [vertices[l1], vertices[(l1 + 1) % 3]],
      }),
      (controlFrame[l2] as LineOutline).copy({
        controlPoints: [vertices[l2], vertices[(l2 + 1) % 3]],
      }),
      (controlFrame[h] as Handle).copy({ x: vertices[h % 3].x, y: vertices[h % 3].y }),
    ];
    return modifiedShapes;
  }
}
