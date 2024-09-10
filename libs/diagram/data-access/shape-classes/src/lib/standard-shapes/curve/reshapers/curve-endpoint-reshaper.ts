import { Reshaper } from '../../../reshaper/reshaper';
import { Shape } from '../../../shape';

export abstract class CurveEndpointReshaper extends Reshaper {
  modifiedFrameForDrag(controlFrame: Shape[]): Shape[] {
    return controlFrame.map((shape) => shape.copy({ visible: false }));
  }
}
