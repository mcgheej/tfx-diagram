import { Shape } from '@tfx-diagram/diagram-data-access-shape-base-class';
import { pointAdd, pointFromPolarPoint } from '@tfx-diagram/diagram/util/misc-functions';
import { ArcOutline } from '../../../control-shapes/arc-outline';
import { Handle } from '../../../control-shapes/handle';
import { LineOutline } from '../../../control-shapes/line-outline';
import { Reshaper } from '../../../reshaper';
import { ARC_HANDLE_LENGTH } from '../../../types/constants';
import { Arc } from '../arc';

export abstract class ArcReshaper extends Reshaper {
  /**
   *
   * @param shape
   * @param controlFrame
   * @param handle
   * @returns
   *
   * Modifies control frame shapes taking into account modified shape
   */
  modifiedControlFrame(shape: Shape, controlFrame: Shape[]): Shape[] {
    const { x, y, radius, sAngle, eAngle } = shape as Arc;
    const mAngle =
      eAngle >= sAngle
        ? (eAngle - sAngle) / 2 + sAngle
        : ((360 - sAngle + eAngle) / 2 + sAngle) % 360;
    const c = { x, y };
    const sPoint = pointAdd(
      c,
      pointFromPolarPoint({ r: radius + ARC_HANDLE_LENGTH, a: sAngle })
    );
    const ePoint = pointAdd(
      c,
      pointFromPolarPoint({ r: radius + ARC_HANDLE_LENGTH, a: eAngle })
    );
    const mPoint = pointAdd(c, pointFromPolarPoint({ r: radius, a: mAngle }));
    const modifiedControlFrame = [];
    modifiedControlFrame.push(
      (controlFrame[0] as LineOutline).copy({ controlPoints: [c, sPoint] })
    );
    modifiedControlFrame.push(
      (controlFrame[1] as LineOutline).copy({ controlPoints: [c, ePoint] })
    );
    modifiedControlFrame.push((controlFrame[2] as ArcOutline).copy({ radius, sAngle, eAngle }));
    modifiedControlFrame.push((controlFrame[3] as Handle).copy({ x: sPoint.x, y: sPoint.y }));
    modifiedControlFrame.push((controlFrame[4] as Handle).copy({ x: ePoint.x, y: ePoint.y }));
    modifiedControlFrame.push((controlFrame[5] as Handle).copy({ x: mPoint.x, y: mPoint.y }));

    return modifiedControlFrame;
  }

  modifiedFrameForDrag(controlFrame: Shape[]): Shape[] {
    return controlFrame;
  }
}
