import { Shape } from '../../shape-hierarchy/shape';
import { Reshaper } from '../reshaper';

export abstract class CurveEndpointReshaper extends Reshaper {
  modifiedFrameForDrag(controlFrame: Shape[]): Shape[] {
    return controlFrame.map((shape) => shape.copy({ visible: false }));
  }
}
