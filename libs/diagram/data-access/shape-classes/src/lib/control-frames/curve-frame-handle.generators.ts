import { Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { HandleProps, HandleTypes, ShapeCursors } from '../props';
import { CurveFinalReshaper } from '../reshapers/curve/curve-final-reshaper';
import { CurveFree1Reshaper } from '../reshapers/curve/curve-free1-reshaper';
import { CurveFree2Reshaper } from '../reshapers/curve/curve-free2-reshaper';
import { CurveLinkReshaper } from '../reshapers/curve/curve-link-reshaper';
import { CurveMidPointReshaper } from '../reshapers/curve/curve-mid-point-reshaper';
import { CurvePostlinkReshaper } from '../reshapers/curve/curve-postlink-reshaper';
import { CurvePrelinkReshaper } from '../reshapers/curve/curve-prelink-reshaper';
import { CurveStartReshaper } from '../reshapers/curve/curve-start-reshaper';
import { NopReshaper, Reshaper } from '../reshapers/reshaper';
import { Handle } from '../shape-hierarchy/drawable-shapes/control-shapes/shapes/handle';
import { Shape } from '../shape-hierarchy/shape';

type PartHandleProps = Pick<
  HandleProps,
  'x' | 'y' | 'handleStyle' | 'pxWidth' | 'cursor' | 'reshaper'
>;

export const createCurveControlPointHandle = (
  i: number,
  cp: Point[],
  associatedShapeId: string
): Handle => {
  const { x, y, handleStyle, pxWidth, cursor, reshaper } = getCurveHandleProps(i, cp);
  const handleType: HandleTypes =
    i === 0
      ? 'connectorStart'
      : i === cp.length - 1
      ? 'connectorFinish'
      : 'notConnectorEnd';
  return new Handle({
    id: Shape.generateId(),
    x,
    y,
    handleStyle,
    pxWidth,
    associatedShapeId,
    selectable: true,
    cursor,
    reshaper,
    handleType,
  });
};

const getCurveHandleProps = (i: number, cp: Point[]): PartHandleProps => {
  let x = 0;
  let y = 0;
  let handleStyle: 'square' | 'round' = 'round';
  let pxWidth = 7;
  let cursor: ShapeCursors = 'default';
  let reshaper: Reshaper = new NopReshaper();
  switch (i % 3) {
    case 0: {
      x = cp[i].x;
      y = cp[i].y;
      handleStyle = 'square';
      pxWidth = 9;
      cursor = 'move';
      reshaper =
        i === 0
          ? new CurveStartReshaper()
          : i === cp.length - 1
          ? new CurveFinalReshaper()
          : new CurveLinkReshaper();
      break;
    }
    case 1: {
      x = (cp[i].x - cp[i - 1].x) / 2 + cp[i - 1].x;
      y = (cp[i].y - cp[i - 1].y) / 2 + cp[i - 1].y;
      reshaper = i === 1 ? new CurveFree1Reshaper() : new CurvePostlinkReshaper();
      break;
    }
    case 2: {
      x = (cp[i].x - cp[i + 1].x) / 2 + cp[i + 1].x;
      y = (cp[i].y - cp[i + 1].y) / 2 + cp[i + 1].y;
      reshaper =
        i === cp.length - 2 ? new CurveFree2Reshaper() : new CurvePrelinkReshaper();
      break;
    }
  }
  return {
    x,
    y,
    pxWidth,
    handleStyle,
    cursor,
    reshaper,
  };
};

export const createMidSegmentHandle = (
  midPoint: Point,
  associatedShapeId: string
): Handle => {
  return new Handle({
    id: Shape.generateId(),
    x: midPoint.x,
    y: midPoint.y,
    handleStyle: 'square',
    pxWidth: 7,
    solid: true,
    associatedShapeId,
    selectable: true,
    cursor: 'crosshair',
    reshaper: new CurveMidPointReshaper(),
  });
};