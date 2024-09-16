import { Shape } from '../../shape-hierarchy/shape';
import { Reshaper } from '../reshaper';

export abstract class CurveNonEndpointReshaper extends Reshaper {
  modifiedFrameForDrag(controlFrame: Shape[]): Shape[] {
    const nSegments = (controlFrame.length - 1) / 6;
    const startHandleIdx = 2 * nSegments;
    const finalHandleIdx = startHandleIdx + 3 * nSegments;
    const modifiedShapes: Shape[] = [];
    for (let i = 0; i < controlFrame.length; i++) {
      if (i === startHandleIdx || i === finalHandleIdx) {
        modifiedShapes.push(controlFrame[i].copy({ visible: false }));
      }
    }
    return modifiedShapes;
  }
}
