import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';
import { Handle } from './control-shapes/handle';
import { RectangleOutline } from './control-shapes/rectangle-outline';
import { Reshaper } from './reshaper/reshaper';
import { Shape } from './shape';
import { Circle } from './standard-shapes/circle/circle';
import { Rectangle } from './standard-shapes/rectangle/rectangle';

export abstract class RectReshaper extends Reshaper {
  modifiedControlFrame(shape: Shape, controlFrame: Shape[]): Shape[] {
    if (shape.shapeType === 'rectangle') {
      return this.rectModifySelectFrame((shape as Rectangle).rect(), controlFrame);
    }
    return this.rectModifySelectFrame((shape as Circle).rect(), controlFrame);
  }

  private rectModifySelectFrame(rect: Rect, controlFrame: Shape[]): Shape[] {
    const { x, y, width, height } = rect;
    return [
      (controlFrame[0] as RectangleOutline).copy({
        x,
        y,
        width,
        height,
      }),
      (controlFrame[1] as Handle).copy({
        // top left
        x,
        y,
      }),
      (controlFrame[2] as Handle).copy({
        // top middle
        x: x + width / 2,
        y,
      }),
      (controlFrame[3] as Handle).copy({
        // top right
        x: x + width,
        y,
      }),
      (controlFrame[4] as Handle).copy({
        // right middle
        x: x + width,
        y: y + height / 2,
      }),
      (controlFrame[5] as Handle).copy({
        // bottom right
        x: x + width,
        y: y + height,
      }),
      (controlFrame[6] as Handle).copy({
        // bottom middle
        x: x + width / 2,
        y: y + height,
      }),
      (controlFrame[7] as Handle).copy({
        // bottom left
        x,
        y: y + height,
      }),
      (controlFrame[8] as Handle).copy({
        // left middle
        x,
        y: y + height / 2,
      }),
    ];
  }

  modifiedFrameForDrag(controlFrame: Shape[]): Shape[] {
    const modifiedControlShapes: Shape[] = [];
    for (let i = 1; i < controlFrame.length; i++) {
      if (controlFrame[i].shapeType === 'handle') {
        modifiedControlShapes.push((controlFrame[i] as Handle).copy({ visible: false }));
      }
    }
    return modifiedControlShapes;
  }
}
