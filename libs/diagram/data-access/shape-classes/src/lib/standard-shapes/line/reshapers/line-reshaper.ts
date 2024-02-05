import { Shape } from '@tfx-diagram/diagram-data-access-shape-base-class';
import { Reshaper } from '../../../reshaper';

export abstract class LineReshaper extends Reshaper {
  modifiedFrameForDrag(controlFrame: Shape[]): Shape[] {
    return controlFrame.map((shape) => shape.copy({ visible: false }));
  }
}
