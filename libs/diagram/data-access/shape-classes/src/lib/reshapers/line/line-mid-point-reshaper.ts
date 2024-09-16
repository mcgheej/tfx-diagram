import { GridProps, Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { lineInterpolate } from '../../misc-functions';
import { Line } from '../../shape-hierarchy/drawable-shapes/connectors/line/line';
import { Handle } from '../../shape-hierarchy/drawable-shapes/control-shapes/handle/handle';
import { Shape } from '../../shape-hierarchy/shape';
import { LineControlPointReshaper } from './line-control-point-reshaper';
import { LineReshaper } from './line-reshaper';

export class LineMidPointReshaper extends LineReshaper {
  modifiedShape(
    newHandlePos: Point,
    associatedShape: Shape,
    gridProps: GridProps,
    handle: Handle,
    controlFrame: Shape[]
  ): Shape {
    const associatedLine = associatedShape as Line;
    return associatedLine.copy({
      controlPoints: this.reshape(newHandlePos, associatedLine, handle, controlFrame),
    });
  }

  modifiedControlFrame(shape: Shape, controlFrame: Shape[], handle: Handle): Shape[] {
    const handleIdx = this.findHandleIndex(handle.id, controlFrame);
    if (handleIdx < 0) {
      return [];
    }
    const cp = (shape as Line).controlPoints;

    // Modify the dragged mid point handle to make it a control point handle
    // at the position of the new control point. Add it to the modified shapes
    // array together with the preceding and following control point handles
    // linked to the new control point handles
    const modifiedShapes = this.repurposeMidPoint(cp, controlFrame, handle, handleIdx);

    // Now create the two new mid point handles for the new line segments
    // created by the addition of the new control point.
    modifiedShapes.push(
      ...this.addNewMidPointHandles(cp, controlFrame, handle, handleIdx)
    );

    return modifiedShapes;
    // return lineModifySelectFrame((shape as Line).controlPoints, controlFrame, handle);
  }

  private reshape(
    newHandlePos: Point,
    line: Line,
    handle: Handle,
    controlFrame: Shape[]
  ): Point[] {
    const handleIdx = controlFrame.findIndex((h) => h.id === handle.id);
    const cp = [...line.controlPoints];
    if (handleIdx < cp.length) {
      return cp;
    }
    cp.splice(handleIdx - cp.length + 1, 0, newHandlePos);
    return cp;
  }

  private repurposeMidPoint(
    cp: Point[],
    controlFrame: Shape[],
    handle: Handle,
    handleIdx: number
  ): Shape[] {
    const modifiedShapes: Shape[] = [];
    const { x, y } = cp[handleIdx - cp.length + 2];
    const prevCpHandle = controlFrame[handleIdx - cp.length + 1] as Handle;
    const nextCpHandle = controlFrame[handleIdx - cp.length + 2] as Handle;
    const newCpHandle = handle.copy({
      prevShapeId: prevCpHandle.id,
      nextShapeId: nextCpHandle.id,
      x,
      y,
      pxWidth: 9,
      cursor: 'move',
      solid: false,
      reshaper: new LineControlPointReshaper(),
    });
    modifiedShapes.push(prevCpHandle.copy({ nextShapeId: newCpHandle.id }));
    modifiedShapes.push(newCpHandle);
    modifiedShapes.push(nextCpHandle.copy({ prevShapeId: newCpHandle.id }));
    return modifiedShapes;
  }

  private addNewMidPointHandles(
    cp: Point[],
    controlFrame: Shape[],
    handle: Handle,
    handleIdx: number
  ): Shape[] {
    const modifiedShapes: Shape[] = [];
    const base = handleIdx - cp.length + 1;
    const p1 = lineInterpolate(cp[base], cp[base + 1], 0.5);
    const p2 = lineInterpolate(cp[base + 1], cp[base + 2], 0.5);
    const id1 = Shape.generateId();
    const id2 = Shape.generateId();
    const newMidPointHandle1 = this.createMidPointHandle(
      id1,
      handle.prevShapeId,
      id2,
      handle.associatedShapeId,
      p1
    );
    const newMidPointHandle2 = this.createMidPointHandle(
      id2,
      id1,
      handle.nextShapeId,
      handle.associatedShapeId,
      p2
    );

    modifiedShapes.push(
      (controlFrame[handleIdx - 1] as Handle).copy({ nextShapeId: newMidPointHandle1.id })
    );
    modifiedShapes.push(newMidPointHandle1);
    modifiedShapes.push(newMidPointHandle2);
    if (handle.nextShapeId) {
      modifiedShapes.push(
        (controlFrame[handleIdx + 1] as Handle).copy({
          prevShapeId: newMidPointHandle2.id,
        })
      );
    }
    return modifiedShapes;
  }

  private createMidPointHandle(
    id: string,
    prevShapeId: string,
    nextShapeId: string,
    associatedShapeId: string,
    pos: Point
  ): Handle {
    return new Handle({
      id,
      prevShapeId,
      nextShapeId,
      x: pos.x,
      y: pos.y,
      handleStyle: 'square',
      pxWidth: 7,
      solid: true,
      associatedShapeId,
      selectable: true,
      cursor: 'crosshair',
      visible: false,
      reshaper: new LineMidPointReshaper(),
    });
  }
}
