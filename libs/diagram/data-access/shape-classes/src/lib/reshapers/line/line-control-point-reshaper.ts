import { GridProps, Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Connection, ConnectorEndTypes } from '../../connections/connection';
import { gridSnapPoint, lineInterpolate } from '../../misc-functions';
import { Line } from '../../shape-hierarchy/drawable-shapes/connectors/line/line';
import { Handle } from '../../shape-hierarchy/drawable-shapes/control-shapes/handle/handle';
import { Shape } from '../../shape-hierarchy/shape';
import { LineReshaper } from './line-reshaper';

export class LineControlPointReshaper extends LineReshaper {
  modifiedByConnection(line: Line, end: ConnectorEndTypes, newPos: Point): Line {
    const cp = [...line.controlPoints];
    if (end === 'connectorStart') {
      cp[0] = { ...newPos };
    } else {
      cp[cp.length - 1] = { ...newPos };
    }
    return line.copy({ controlPoints: cp });
  }

  modifiedShape(
    newHandlePos: Point,
    associatedShape: Shape,
    gridProps: GridProps,
    handle: Handle,
    controlFrame: Shape[],
    connectionHook: Connection | null
  ): Shape {
    const associatedLine = associatedShape as Line;
    if (connectionHook && connectionHook.shapeId) {
      return associatedLine.copy({
        controlPoints: this.reshape(newHandlePos, associatedLine, handle, controlFrame),
      });
    }
    const newPos = gridSnapPoint(newHandlePos, gridProps);
    return associatedLine.copy({
      controlPoints: this.reshape(newPos, associatedLine, handle, controlFrame),
    });
  }

  modifiedControlFrame(shape: Shape, controlFrame: Shape[], handle: Handle): Shape[] {
    const handleIdx = this.findHandleIndex(handle.id, controlFrame);
    if (handleIdx < 0) {
      return [];
    }
    const cp = (shape as Line).controlPoints;
    if (controlFrame.length !== cp.length * 2 - 1 || handleIdx >= cp.length) {
      return [];
    }
    const modifiedHandles = [this.copyHandle(handle, cp[handleIdx])];
    let i = cp.length - 1 + handleIdx;
    if (i >= cp.length) {
      const p = lineInterpolate(cp[handleIdx], cp[handleIdx - 1], 0.5);
      modifiedHandles.push(this.copyHandle(controlFrame[i] as Handle, p));
    }
    i++;
    if (i < controlFrame.length) {
      const p = lineInterpolate(cp[handleIdx], cp[handleIdx + 1], 0.5);
      modifiedHandles.push(this.copyHandle(controlFrame[i] as Handle, p));
    }
    return modifiedHandles;
  }

  private reshape(
    newHandlePos: Point,
    line: Line,
    handle: Handle,
    controlFrame: Shape[]
  ): Point[] {
    const handleIdx = controlFrame.findIndex((h) => h.id === handle.id);
    const cp = [...line.controlPoints];
    if (handleIdx < 0) {
      return cp;
    }
    cp[handleIdx] = newHandlePos;
    return cp;
  }

  private copyHandle(handle: Handle, p: Point): Handle {
    return handle.copy({
      x: p.x,
      y: p.y,
    });
  }
}
