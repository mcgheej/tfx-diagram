import { Shape } from '@tfx-diagram/diagram-data-access-shape-base-class';
import { Reshaper } from '@tfx-diagram/diagram-data-access-shape-reshapers';

export abstract class CurveEndpointReshaper extends Reshaper {
  modifiedFrameForDrag(controlFrame: Shape[]): Shape[] {
    return controlFrame.map((shape) => shape.copy({ visible: false }));
  }
}
