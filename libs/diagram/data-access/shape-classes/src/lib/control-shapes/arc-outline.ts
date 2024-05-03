import {
  Connection,
  ControlShape,
  Shape,
} from '@tfx-diagram/diagram-data-access-shape-base-class';
import { ColorMapRef } from '@tfx-diagram/diagram/data-access/color-classes';
import {
  ColorRef,
  Point,
  ShapeInspectorData,
  Transform,
} from '@tfx-diagram/electron-renderer-web/shared-types';
import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';
import { ArcConfig, ArcProps, arcDefaults } from '../standard-shapes/arc/arc';
import { calcArcBoundingBox } from '../standard-shapes/arc/calc-arc-bounding-box';
import { DEFAULT_OUTLINE_COLOUR } from '../types';

type DrawingParams = Pick<ArcProps, 'x' | 'y' | 'radius'>;

export class ArcOutline extends ControlShape implements ArcProps {
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
    super({ ...config, shapeType: 'arcOutline', cursor: 'move' });
    this.x = config.x ?? arcDefaults.x;
    this.y = config.y ?? arcDefaults.y;
    this.radius = config.radius ?? arcDefaults.radius;
    this.sAngle = (config.sAngle ?? arcDefaults.sAngle) % 360;
    this.eAngle = (config.eAngle ?? arcDefaults.eAngle) % 360;
    this.circleSegment = true;
    this.lineDash = [];
    this.lineWidth = 0;
    this.strokeStyle = DEFAULT_OUTLINE_COLOUR;
    this.fillStyle = arcDefaults.fillStyle;
  }

  anchor(): Point {
    return {
      x: this.x,
      y: this.y,
    };
  }

  attachBoundary(): Connection | undefined {
    return undefined;
  }

  boundingBox(): Rect {
    return calcArcBoundingBox(this);
  }

  changeLineColor(): undefined {
    return undefined;
  }

  changeFillColor(): undefined {
    return undefined;
  }

  changeLineDash(): Shape | undefined {
    return undefined;
  }

  changeLineWidth(): Shape | undefined {
    return undefined;
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
      fillColor: { colorSet: 'empty', ref: '' },
    };
  }

  copy(amendments: Partial<ArcProps>): ArcOutline {
    const a = amendments;
    const s = new ArcOutline({
      id: this.id,
      prevShapeId: a.prevShapeId ?? this.prevShapeId,
      nextShapeId: a.nextShapeId ?? this.nextShapeId,
      cursor: a.cursor ?? this.cursor,
      x: a.x ?? this.x,
      y: a.y ?? this.y,
      radius: a.radius ?? this.radius,
      sAngle: (a.sAngle ?? this.sAngle) % 360,
      eAngle: (a.eAngle ?? this.eAngle) % 360,
      circleSegment: this.circleSegment,
      strokeStyle: this.strokeStyle,
      fillStyle: this.fillStyle,
      lineDash: this.lineDash,
      lineWidth: this.lineWidth,
    } as ArcProps);
    return s;
  }

  dragOffset(): Point {
    return { x: 0, y: 0 };
  }

  draw(c: CanvasRenderingContext2D, t: Transform): void {
    const params = this.getParams(t);
    c.save();
    this.drawArc(c, params, t);
    c.restore();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  drawShadow(): void {}

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

  highLightFrame(): Shape[] {
    return [];
  }

  inspectorViewData(): ShapeInspectorData[] {
    return [];
  }

  move(shiftDelta: Point): Shape {
    return this.copy({
      x: this.x + shiftDelta.x,
      y: this.y + shiftDelta.y,
    });
  }

  outlineShapes(): Shape[] {
    return [];
  }

  selectFrame(): Shape[] {
    return [];
  }

  text(): string {
    return '';
  }

  private drawArc(c: CanvasRenderingContext2D, params: DrawingParams, t: Transform) {
    const { x, y } = params;
    let { radius } = params;
    radius = Math.max(radius, 3);
    const strokeColor = ColorMapRef.resolve(this.strokeStyle);
    if (strokeColor) {
      c.strokeStyle = strokeColor;
      c.lineWidth = 1;
      c.beginPath();
      c.arc(x, y, radius, (this.sAngle * Math.PI) / 180, (this.eAngle * Math.PI) / 180);
      c.stroke();
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
    };
  }
}
