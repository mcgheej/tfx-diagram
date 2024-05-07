import { ControlShape, Shape } from '@tfx-diagram/diagram-data-access-shape-base-class';
import { ColorMapRef } from '@tfx-diagram/diagram/data-access/color-classes';
import {
  ColorRef,
  Point,
  TextBoxConfig,
  Transform,
} from '@tfx-diagram/electron-renderer-web/shared-types';
import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';
import {
  RectangleConfig,
  RectangleProps,
  rectangleDefaults,
} from '../standard-shapes/rectangle/rectangle';
import { DEFAULT_OUTLINE_COLOUR } from '../types';

type DrawingParams = Pick<RectangleProps, 'x' | 'y' | 'width' | 'height'>;

export class RectangleOutline extends ControlShape implements RectangleProps {
  x: number;
  y: number;
  width: number;
  height: number;
  lineDash: number[];
  lineWidth: number;
  strokeStyle: ColorRef;
  fillStyle: ColorRef;
  textConfig: TextBoxConfig;

  constructor(config: RectangleConfig) {
    super({ ...config, shapeType: 'rectangleOutline', cursor: 'move', selectable: false });
    this.x = config.x ?? rectangleDefaults.x;
    this.y = config.y ?? rectangleDefaults.y;
    this.width = config.width ?? rectangleDefaults.width;
    this.height = config.height ?? rectangleDefaults.height;
    this.lineDash = [];
    this.lineWidth = 0;
    this.strokeStyle = DEFAULT_OUTLINE_COLOUR;
    (this.fillStyle = { colorSet: 'empty', ref: '' }), (this.selectable = false);
    this.textConfig = {};
  }

  anchor(): Point {
    return {
      x: this.x,
      y: this.y,
    };
  }

  boundingBox(): Rect {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    } as Rect;
  }

  colors(): { lineColor: ColorRef; fillColor: ColorRef } {
    return {
      lineColor: this.strokeStyle,
      fillColor: this.fillStyle,
    };
  }

  copy(amendments: Partial<RectangleProps>): RectangleOutline {
    const a = amendments;
    const r = new RectangleOutline({
      id: this.id,
      prevShapeId: a.prevShapeId ?? this.prevShapeId,
      nextShapeId: a.nextShapeId ?? this.nextShapeId,
      cursor: a.cursor ?? this.cursor,
      x: a.x ?? this.x,
      y: a.y ?? this.y,
      width: a.width ?? this.width,
      height: a.height ?? this.height,
      lineDash: this.lineDash,
      lineWidth: this.lineWidth,
      strokeStyle: this.strokeStyle,
      fillStyle: this.fillStyle,
      textConfig: this.textConfig,
      selectable: false,
      visible: a.visible ?? this.visible,
    } as RectangleProps);
    return r;
  }

  dragOffset() {
    return { x: 0, y: 0 };
  }

  draw(c: CanvasRenderingContext2D, t: Transform): void {
    if (!this.visible) {
      return;
    }
    const params = this.getParams(t);
    c.save();
    this.drawRectangle(c, params);
    c.restore();
  }

  getProps(): RectangleProps {
    return {
      id: this.id,
      prevShapeId: this.prevShapeId,
      nextShapeId: this.nextShapeId,
      groupId: this.groupId,
      shapeType: this.shapeType,
      cursor: this.cursor,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      strokeStyle: this.strokeStyle,
      fillStyle: this.fillStyle,
      lineDash: this.lineDash,
      lineWidth: this.lineWidth,
      selectable: false,
      visible: this.visible,
      textConfig: this.textConfig,
    };
  }

  move(shiftDelta: Point): Shape {
    return this.copy({
      x: this.x + shiftDelta.x,
      y: this.y + shiftDelta.y,
    });
  }

  private drawRectangle(c: CanvasRenderingContext2D, params: DrawingParams) {
    const { x, y, width, height } = params;
    c.strokeStyle = ColorMapRef.resolve(this.strokeStyle);
    c.lineWidth = 1;
    c.beginPath();
    c.rect(x, y, width, height);
    c.stroke();
  }

  private getParams(t: Transform): DrawingParams {
    return {
      x: t.scaleFactor * (this.x + t.transX),
      y: t.scaleFactor * (this.y + t.transY),
      width: t.scaleFactor * this.width,
      height: t.scaleFactor * this.height,
    };
  }
}
