import { GridProps, Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Shape } from '../shape';
import { Connection } from '../connection';

export abstract class Reshaper {
  abstract modifiedShape(
    newHandlePos: Point,
    associatedShape: Shape,
    gridProps: GridProps,
    handle: Shape,
    controlFrame: Shape[],
    connectionHook: Connection | null
  ): Shape;

  abstract modifiedControlFrame(shape: Shape, controlFrame: Shape[], handle: Shape): Shape[];

  abstract modifiedFrameForDrag(controlFrame: Shape[]): Shape[];

  protected findHandleIndex(handleId: string, controlFrame: Shape[]): number {
    return controlFrame.findIndex((h) => h.id === handleId);
  }
}

export class NopReshaper extends Reshaper {
  modifiedShape(newHandlePos: Point, associatedShape: Shape): Shape {
    return associatedShape;
  }

  modifiedControlFrame(): Shape[] {
    return [];
  }

  modifiedFrameForDrag(): Shape[] {
    return [];
  }
}
