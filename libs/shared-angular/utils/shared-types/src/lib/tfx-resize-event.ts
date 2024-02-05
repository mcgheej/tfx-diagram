import { Rect } from './rect';

export class TfxResizeEvent {
  public newRect: Rect;
  public oldRect?: Rect;
  public isFirst: boolean;

  public constructor(newRect: Rect, oldRect: Rect | undefined) {
    this.newRect = newRect;
    this.oldRect = oldRect;
    this.isFirst = oldRect ? true : false;
  }
}
