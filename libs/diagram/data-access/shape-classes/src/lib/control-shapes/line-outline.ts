import {
  Connection,
  ControlShape,
  Shape,
} from '@tfx-diagram/diagram-data-access-shape-base-class';
import { ColorMapRef } from '@tfx-diagram/diagram/data-access/color-classes';
import { Endpoint } from '@tfx-diagram/diagram/data-access/endpoint-classes';
import {
  pointAdd,
  rectInflate,
  rectNormalised,
  rectUnionArray,
} from '@tfx-diagram/diagram/util/misc-functions';
import {
  ColorRef,
  Point,
  ShapeInspectorData,
  Transform,
} from '@tfx-diagram/electron-renderer-web/shared-types';
import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';
import { LineConfig, lineDefaults, LineProps } from '../standard-shapes/line/line';
import { DEFAULT_OUTLINE_COLOUR } from '../types';

type DrawingParams = Pick<LineProps, 'controlPoints'>;

export class LineOutline extends ControlShape implements LineProps {
  controlPoints: Point[];
  lineDash: number[];
  lineWidth: number;
  strokeStyle: ColorRef;
  startEndpoint: Endpoint | null;
  finishEndpoint: Endpoint | null;

  constructor(config: LineConfig) {
    super({ ...config, shapeType: 'line', cursor: 'move' });
    this.controlPoints = this.validateControlPoints(config);
    this.lineWidth = 0;
    this.lineDash = [];
    this.strokeStyle = DEFAULT_OUTLINE_COLOUR;
    this.selectable = false;
    this.startEndpoint = null;
    this.finishEndpoint = null;
  }

  anchor(): Point {
    return {
      x: this.controlPoints[0].x,
      y: this.controlPoints[0].y,
    };
  }

  attachBoundary(): Connection | undefined {
    return undefined;
  }

  boundingBox(): Rect {
    return rectInflate(this.calcBoundingBox(this.controlPoints), this.lineWidth / 2);
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

  copy(amendments: Partial<LineProps>): LineOutline {
    const a = amendments;
    const l = new LineOutline({
      id: this.id,
      prevShapeId: a.prevShapeId ?? this.prevShapeId,
      nextShapeId: a.nextShapeId ?? this.nextShapeId,
      cursor: a.cursor ?? this.cursor,
      controlPoints: a.controlPoints ?? this.controlPoints,
      lineDash: this.lineDash,
      lineWidth: this.lineWidth,
      strokeStyle: this.strokeStyle,
      selectable: false,
      visible: a.visible ?? this.visible,
      startEndpoint: null,
      finishEndpoint: null,
    } as LineProps);
    return l;
  }

  dragOffset(): Point {
    return { x: 0, y: 0 };
  }

  draw(c: CanvasRenderingContext2D, t: Transform): void {
    if (!this.visible) {
      return;
    }
    const params = this.getParams(t);
    c.save();
    this.drawLine(c, params);
    c.restore();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  drawShadow(): void {}

  getProps(): LineProps {
    return {
      id: this.id,
      prevShapeId: this.prevShapeId,
      nextShapeId: this.nextShapeId,
      groupId: this.groupId,
      shapeType: this.shapeType,
      cursor: this.cursor,
      strokeStyle: this.strokeStyle,
      controlPoints: this.controlPoints,
      lineDash: this.lineDash,
      lineWidth: this.lineWidth,
      selectable: this.selectable,
      visible: this.visible,
      startEndpoint: null,
      finishEndpoint: null,
    };
  }

  highLightFrame(): Shape[] {
    return [];
  }

  inspectorViewData(): ShapeInspectorData[] {
    return [];
  }

  move(shiftDelta: Point): Shape {
    const cp = this.controlPoints.map((p) => pointAdd(p, shiftDelta));
    return this.copy({
      controlPoints: cp,
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

  private drawLine(c: CanvasRenderingContext2D, params: DrawingParams) {
    const { controlPoints: cp } = params;
    if (cp.length < 2) {
      return;
    }

    c.strokeStyle = ColorMapRef.resolve(this.strokeStyle);
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(cp[0].x, cp[0].y);
    for (let i = 1; i < cp.length; i++) {
      c.lineTo(cp[i].x, cp[i].y);
    }
    c.stroke();
  }

  private validateControlPoints(config: LineConfig): Point[] {
    if (config.controlPoints) {
      if (config.controlPoints.length < 2) {
        return lineDefaults.controlPoints;
      }
      return config.controlPoints;
    }
    return lineDefaults.controlPoints;
  }

  private getParams(t: Transform): DrawingParams {
    const cp = this.controlPoints.map((p) => {
      return {
        x: t.scaleFactor * (p.x + t.transX),
        y: t.scaleFactor * (p.y + t.transY),
      };
    });
    return {
      controlPoints: cp,
    };
  }

  private calcBoundingBox(cp: Point[]): Rect {
    const emptyRect: Rect = { x: 0, y: 0, width: 0, height: 0 };
    if (cp.length < 2) {
      return emptyRect;
    }
    const lineRects: Rect[] = [];
    for (let i = 1; i < cp.length; i++) {
      lineRects.push(rectNormalised(cp[i - 1], cp[i]));
    }
    return rectUnionArray(lineRects);
  }
}
