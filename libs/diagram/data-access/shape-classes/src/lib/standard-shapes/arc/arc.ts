/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Connection,
  Shape,
  ShapeProps,
} from '@tfx-diagram/diagram-data-access-shape-base-class';
import { ColorMapRef } from '@tfx-diagram/diagram/data-access/color-classes';
import {
  ColorRef,
  PartPartial,
  Point,
  ShapeInspectorData,
  ShapeResizeOptions,
  Transform,
} from '@tfx-diagram/electron-renderer-web/shared-types';
import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';

export interface ArcProps extends ShapeProps {
  x: number;
  y: number;
  radius: number;
  sAngle: number;
  eAngle: number;
  circleSegment: boolean;
  lineDash: number[];
  lineWidth: number;
  strokeStyle: ColorRef;
  fillStyle: ColorRef;
}

export type ArcConfig = PartPartial<Omit<ArcProps, 'shapeType'>, 'id'>;

const arcDefaults: Omit<ArcProps, keyof ShapeProps> = {
  x: 50,
  y: 50,
  radius: 25,
  sAngle: 0,
  eAngle: 90,
  circleSegment: false,
  lineDash: [],
  lineWidth: 0.5,
  strokeStyle: { colorSet: 'theme', ref: 'text-3' },
  fillStyle: { colorSet: 'empty', ref: '' },
};

type DrawingParams = Pick<ArcProps, 'x' | 'y' | 'radius' | 'lineWidth'>;

export class Arc extends Shape implements ArcProps {
  x: number;
  y: number;
  radius: number;
  sAngle: number;
  eAngle: number;
  circleSegment: boolean;
  lineDash: number[];
  lineWidth: number;
  strokeStyle: ColorRef;
  fillStyle: ColorRef;

  constructor(config: ArcConfig) {
    super({ ...config, shapeType: 'arc', cursor: 'move' });
    this.x = config.x ?? arcDefaults.x;
    this.y = config.y ?? arcDefaults.y;
    this.radius = config.radius ?? arcDefaults.radius;
    this.sAngle = config.sAngle ?? arcDefaults.sAngle;
    this.eAngle = config.eAngle ?? arcDefaults.eAngle;
    this.circleSegment = config.circleSegment ?? arcDefaults.circleSegment;
    this.lineDash = config.lineDash ?? arcDefaults.lineDash;
    this.lineWidth = config.lineWidth ?? arcDefaults.lineWidth;
    this.strokeStyle = config.strokeStyle ?? arcDefaults.strokeStyle;
    this.fillStyle = config.fillStyle ?? arcDefaults.fillStyle;
  }

  anchor(): Point {
    return {
      x: this.x,
      y: this.y,
    };
  }

  attachBoundary(
    point: Point,
    t: Transform,
    connectionHook: Connection
  ): Connection | undefined {
    return undefined;
  }

  /**
   * TODO: Implement algorithm to get bounding box for circle segment
   *
   * @returns
   */
  boundingBox(): Rect {
    return {
      x: this.x - this.radius,
      y: this.y - this.radius,
      width: this.radius * 2,
      height: this.radius * 2,
    } as Rect;
  }

  changeLineColor(lineColor: ColorRef): Arc {
    return this.copy({ strokeStyle: lineColor });
  }

  changeFillColor(fillColor: ColorRef): Arc {
    return this.copy({ fillStyle: fillColor });
  }

  changeLineDash(lineDash: number[]): Arc {
    return this.copy({ lineDash });
  }

  changeLineWidth(lineWidth: number): Arc {
    return this.copy({ lineWidth });
  }

  changeStartEndpoint(): Shape | undefined {
    return undefined;
  }

  changeFinishEndpoint(): Shape | undefined {
    return undefined;
  }

  changeTextConfig(): Shape | undefined {
    return undefined;
  }

  colors(): { lineColor: ColorRef; fillColor: ColorRef } {
    return {
      lineColor: this.strokeStyle,
      fillColor: this.fillStyle,
    };
  }

  copy(amendments: Partial<ArcProps>): Arc {
    const a = amendments;
    const s = new Arc({
      id: a.id ?? this.id,
      prevShapeId: a.prevShapeId ?? this.prevShapeId,
      nextShapeId: a.nextShapeId ?? this.nextShapeId,
      cursor: a.cursor ?? this.cursor,
      groupId: a.groupId ?? this.groupId,
      selectable: a.selectable ?? this.selectable,
      visible: a.visible ?? this.visible,
      x: a.x ?? this.x,
      y: a.y ?? this.y,
      radius: a.radius ?? this.radius,
      sAngle: a.sAngle ?? this.sAngle,
      eAngle: a.eAngle ?? this.eAngle,
      circleSegment: a.circleSegment ?? this.circleSegment,
      strokeStyle: a.strokeStyle ?? this.strokeStyle,
      fillStyle: a.fillStyle ?? this.fillStyle,
      lineDash: a.lineDash ?? this.lineDash,
      lineWidth: a.lineWidth ?? this.lineWidth,
    } as ArcProps);
    return s;
  }

  dragOffset(mousePagePos: Point): Point {
    return {
      x: mousePagePos.x - this.x,
      y: mousePagePos.y - this.y,
    };
  }

  draw(c: CanvasRenderingContext2D, t: Transform): void {
    const params = this.getParams(t);
    c.save();
    this.drawArc(c, params, t);
    c.restore();
  }

  // TODO: Need to implement this
  drawShadow(s: CanvasRenderingContext2D, t: Transform): void {
    return;
  }

  getProps(): ArcProps {
    return {
      id: this.id,
      prevShapeId: this.prevShapeId,
      nextShapeId: this.nextShapeId,
      cursor: this.cursor,
      groupId: this.groupId,
      selectable: this.selectable,
      visible: this.visible,
      x: this.x,
      y: this.y,
      radius: this.radius,
      sAngle: this.sAngle,
      eAngle: this.eAngle,
      circleSegment: this.circleSegment,
      strokeStyle: this.strokeStyle,
      fillStyle: this.fillStyle,
      lineDash: this.lineDash,
      lineWidth: this.lineWidth,
    } as ArcProps;
  }

  // TODO: Need to implement this
  highLightFrame(shapes: Map<string, Shape>): Shape[] {
    return [];
  }

  inspectorViewData(): ShapeInspectorData[] {
    return [
      { propName: 'x', value: this.x.toFixed(2) },
      { propName: 'y', value: this.y.toFixed(2) },
      { propName: 'radius', value: this.radius.toFixed(2) },
    ];
  }

  move(shiftDelta: Point): Shape {
    return this.copy({
      x: this.x + shiftDelta.x,
      y: this.y + shiftDelta.y,
    });
  }

  // TODO: Need to implement this
  outlineShapes(): Shape[] {
    return [];
  }

  // TODO: Need to implement this
  resizeToBox(r: Rect, resizeOption: ShapeResizeOptions): Arc {
    return this.copy({});
  }

  // TODO: Need to implement this
  selectFrame(shapes: Map<string, Shape>): Shape[] {
    return [];
  }

  text(): string {
    return '';
  }

  // abstract text(): string;

  private drawArc(c: CanvasRenderingContext2D, params: DrawingParams, t: Transform) {
    const { x, y } = params;
    let { lineWidth, radius } = params;
    lineWidth = Math.max(lineWidth, 2);
    radius = Math.max(radius, 3);
    const s = ((1 + this.lineWidth / 0.25) / 2) * t.scaleFactor;
    const scaledLineDash = this.lineDash.map((dotDash) => {
      const scaledDotDash = dotDash * s;
      return scaledDotDash < 1 ? 1 : scaledDotDash;
    });

    const fillColor = ColorMapRef.resolve(this.fillStyle);
    if (fillColor && this.circleSegment) {
      c.fillStyle = fillColor;
      c.beginPath();
      c.moveTo(x, y);
      c.arc(x, y, radius, (this.sAngle * Math.PI) / 180, (this.eAngle * Math.PI) / 180);
      c.lineTo(x, y);
      c.fill();
    }
    const strokeColor = ColorMapRef.resolve(this.strokeStyle);
    if (strokeColor) {
      c.strokeStyle = strokeColor;
      c.lineWidth = lineWidth;
      c.setLineDash(scaledLineDash);
      if (this.circleSegment) {
        c.beginPath();
        c.moveTo(x, y);
        c.arc(x, y, radius, (this.sAngle * Math.PI) / 180, (this.eAngle * Math.PI) / 180);
        c.lineTo(x, y);
        c.arc(x, y, radius, (this.sAngle * Math.PI) / 180, (this.eAngle * Math.PI) / 180);
        c.stroke();
      } else {
        c.beginPath();
        c.arc(x, y, radius, (this.sAngle * Math.PI) / 180, (this.eAngle * Math.PI) / 180);
        c.stroke();
      }
    }
  }

  /**
   *
   * @param t - Current Page Window to Page Viewport transformation
   * @returns - transformed drawing parameters
   */
  private getParams(t: Transform): DrawingParams {
    return {
      x: t.scaleFactor * (this.x + t.transX),
      y: t.scaleFactor * (this.y + t.transY),
      radius: t.scaleFactor * this.radius,
      lineWidth: t.scaleFactor * this.lineWidth,
    };
  }
}
