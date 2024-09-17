import { ColorMapRef } from '@tfx-diagram/diagram/data-access/color-classes';
import {
  pointAdd,
  pointTransform,
  rectInflate,
  rectUnionArray,
} from '@tfx-diagram/diagram/util/misc-functions';
import {
  ColorRef,
  Point,
  Range,
  ShapeInspectorData,
  ShapeResizeOptions,
  Transform,
} from '@tfx-diagram/electron-renderer-web/shared-types';
import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';
import { Connection, ConnectorEndTypes } from '../../../../connections/connection';
import { curveSelectFrame } from '../../../../control-frames/curve-select-frame';
import { Endpoint } from '../../../../endpoints';
import { calcBezierValue, linkShapeArray } from '../../../../misc-functions';
import {
  AllShapeProps,
  CurveConfig,
  CurveProps,
  ShapeProps,
  SharedProperties,
} from '../../../../props';
import {
  CurveFinalReshaper,
  CurveStartReshaper,
  NopReshaper,
} from '../../../../reshapers';
import { Shape } from '../../../shape';
import { Group } from '../../../structural-shapes/group/group';
import { Handle } from '../../control-shapes/handle/handle';
import { Connector } from '../connector';

export const curveDefaults: Omit<CurveProps, keyof ShapeProps> = {
  controlPoints: [
    { x: 10, y: 10 },
    { x: 20, y: 10 },
    { x: 40, y: 10 },
    { x: 50, y: 10 },
  ],
  lineDash: [],
  lineWidth: 0.5,
  strokeStyle: { colorSet: 'theme', ref: 'text1-3' },
  startEndpoint: null,
  finishEndpoint: null,
};

type DrawingParams = Pick<CurveProps, 'controlPoints' | 'lineWidth'>;

export class Curve extends Connector implements CurveProps {
  controlPoints: Point[];
  lineDash: number[];
  lineWidth: number;
  strokeStyle: ColorRef;
  startEndpoint: Endpoint | null;
  finishEndpoint: Endpoint | null;

  private showFrame = false;

  constructor(config: CurveConfig) {
    super({ ...config, shapeType: 'curve', cursor: 'move' });
    this.controlPoints = this.validateControlPoints(config);
    this.lineDash = config.lineDash ?? curveDefaults.lineDash;
    this.lineWidth = config.lineWidth ?? curveDefaults.lineWidth;
    this.strokeStyle = config.strokeStyle ?? curveDefaults.strokeStyle;
    this.startEndpoint =
      config.startEndpoint === undefined
        ? curveDefaults.startEndpoint
        : config.startEndpoint;
    this.finishEndpoint =
      config.finishEndpoint === undefined
        ? curveDefaults.finishEndpoint
        : config.finishEndpoint;
  }

  reshape(end: ConnectorEndTypes, newPos: Point): Curve {
    if (end === 'connectorStart') {
      return new CurveStartReshaper().modifiedByConnection(this, newPos);
    }
    return new CurveFinalReshaper().modifiedByConnection(this, newPos);
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

  colors(): { lineColor: ColorRef; fillColor: ColorRef } {
    return {
      lineColor: this.strokeStyle,
      fillColor: { colorSet: 'empty', ref: '' },
    };
  }

  copy(amendments: Partial<AllShapeProps>): Curve {
    const a = amendments as Partial<SharedProperties<CurveProps, AllShapeProps>>;
    const c = new Curve({
      id: a.id ?? this.id,
      prevShapeId: a.prevShapeId ?? this.prevShapeId,
      nextShapeId: a.nextShapeId ?? this.nextShapeId,
      groupId: a.groupId ?? this.groupId,
      cursor: a.cursor ?? this.cursor,
      selectable: a.selectable ?? this.selectable,
      visible: a.visible ?? this.visible,
      controlPoints: a.controlPoints ?? [...this.controlPoints],
      lineDash: a.lineDash ?? this.lineDash,
      lineWidth: a.lineWidth ?? this.lineWidth,
      strokeStyle: a.strokeStyle ?? this.strokeStyle,
      startEndpoint: a.startEndpoint === undefined ? this.startEndpoint : a.startEndpoint,
      finishEndpoint:
        a.finishEndpoint === undefined ? this.finishEndpoint : a.finishEndpoint,
    } as CurveProps);
    return c;
  }

  dragOffset(mousePagePos: Point): Point {
    return {
      x: mousePagePos.x - this.controlPoints[0].x,
      y: mousePagePos.y - this.controlPoints[0].y,
    };
  }

  draw(c: CanvasRenderingContext2D, t: Transform): void {
    const params = this.getParams(t);
    let { lineWidth } = params;
    if (lineWidth < 1) {
      lineWidth = 1;
    }
    c.save();
    if (this.showFrame) {
      this.drawFrame(c, params);
    }
    const strokeColor = ColorMapRef.resolve(this.strokeStyle);
    this.drawCurve(c, params, lineWidth, strokeColor, t);
    if (this.startEndpoint) {
      const cp = this.controlPoints.slice(0, 2);
      this.startEndpoint.draw(
        cp[0],
        -Math.atan2(cp[0].y - cp[1].y, cp[1].x - cp[0].x),
        strokeColor,
        this.lineWidth,
        c,
        t
      );
    }
    // TODO - refactor into functions
    if (this.finishEndpoint) {
      const cp = this.controlPoints.slice(-2);
      this.finishEndpoint.draw(
        cp[1],
        -Math.atan2(cp[1].y - cp[0].y, cp[0].x - cp[1].x),
        strokeColor,
        this.lineWidth,
        c,
        t
      );
    }
    if (this.showFrame) {
      this.drawCrosses(c, params);
      this.drawLabels(c, params);
    }
    c.restore();
  }

  drawShadow(s: CanvasRenderingContext2D, t: Transform): void {
    if (!this.visible) {
      return;
    }
    const params = this.getParams(t);
    let { lineWidth } = params;
    if (lineWidth < 4) {
      lineWidth = 10;
    } else {
      lineWidth += 6;
    }
    const strokeStyle = '#' + (+this.id).toString(16);
    s.save();
    this.drawCurve(s, params, lineWidth, strokeStyle, t, true);
    s.restore();
  }

  getProps(): CurveProps {
    return {
      id: this.id,
      prevShapeId: this.prevShapeId,
      nextShapeId: this.nextShapeId,
      groupId: this.groupId,
      shapeType: this.shapeType,
      cursor: this.cursor,
      selectable: this.selectable,
      visible: this.visible,
      strokeStyle: this.strokeStyle,
      controlPoints: this.controlPoints,
      lineDash: this.lineDash,
      lineWidth: this.lineWidth,
      startEndpoint: this.startEndpoint ?? null,
      finishEndpoint: this.finishEndpoint ?? null,
    };
  }

  highLightFrame(shapes: Map<string, Shape>): Shape[] {
    if (this.groupId && shapes) {
      return Group.highlightTopFrame(this.groupId, shapes);
    }
    return this.endPointHandles();
  }

  inspectorViewData(): ShapeInspectorData[] {
    const result: ShapeInspectorData[] = [];
    let i = 1;
    for (const cp of this.controlPoints) {
      result.push({
        propName: `point ${i}`,
        value: `(${cp.x.toFixed(2)}, ${cp.y.toFixed(2)})`,
      });
      i++;
    }
    return result;
  }

  move(shiftDelta: Point): Shape {
    const cp = this.controlPoints.map((p) => pointAdd(p, shiftDelta));
    return this.copy({ controlPoints: cp });
  }

  outlineShapes(): Shape[] {
    return this.endPointHandles(true);
  }

  resizeToBox(r: Rect, resizeOption: ShapeResizeOptions): Curve {
    const newCps: Point[] = [];
    const b = this.boundingBox();
    this.controlPoints.map((cp) => {
      const x =
        resizeOption === 'heightOnly' ? cp.x : ((cp.x - b.x) * r.width) / b.width + b.x;
      const y =
        resizeOption === 'widthOnly' ? cp.y : ((cp.y - b.y) * r.height) / b.height + b.y;
      newCps.push({ x, y });
    });
    return this.copy({ controlPoints: newCps });
  }

  selectFrame(shapes: Map<string, Shape>): Shape[] {
    if (this.groupId && shapes) {
      return Group.selectTopFrame(this.groupId, shapes);
    }
    return curveSelectFrame(this.controlPoints, this.id);
  }

  text(): string {
    return '';
  }

  private drawCurve(
    c: CanvasRenderingContext2D,
    params: DrawingParams,
    lineWidthPx: number,
    strokeStyle: string,
    t: Transform,
    shadow = false
  ) {
    const { controlPoints: cp } = params;
    if (this.controlPointCountInvalid(this.controlPoints)) {
      return;
    }

    if (!shadow) {
      const s = ((1 + this.lineWidth / 0.25) / 2) * t.scaleFactor;
      const scaledLineDash = this.lineDash.map((dotDash) => {
        const scaledDotDash = dotDash * s;
        return scaledDotDash < 1 ? 1 : scaledDotDash;
      });
      c.setLineDash(scaledLineDash);
    }

    c.strokeStyle = strokeStyle;
    c.lineWidth = lineWidthPx;
    c.beginPath();
    c.moveTo(cp[0].x, cp[0].y);
    for (let i = 1; i < cp.length; i += 3) {
      const i1 = i + 1;
      const i2 = i + 2;
      c.bezierCurveTo(cp[i].x, cp[i].y, cp[i1].x, cp[i1].y, cp[i2].x, cp[i2].y);
    }
    c.stroke();
  }

  /**
   *
   * @param config
   * @returns
   *
   * Returns default control points if none supplied or the supplied
   * control points array has an invalid length.
   */
  private validateControlPoints(config: CurveConfig): Point[] {
    if (config.controlPoints) {
      if (this.controlPointCountInvalid(config.controlPoints)) {
        return curveDefaults.controlPoints;
      }
      return config.controlPoints;
    }
    return curveDefaults.controlPoints;
  }

  private controlPointCountInvalid(cp: Point[]): boolean {
    if (cp) {
      return cp.length === 0 || (cp.length - 1) % 3 !== 0;
    }
    return true;
  }

  private getParams(t: Transform): DrawingParams {
    const cp = this.controlPoints.map((p) => {
      return pointTransform(p, t);
    });
    return {
      controlPoints: cp,
      lineWidth: t.scaleFactor * this.lineWidth,
    };
  }

  private endPointHandles(solid = false): Shape[] {
    const lastPointIdx = this.controlPoints.length - 1;
    const handles: Shape[] = [
      new Handle({
        id: Shape.generateId(),
        x: this.controlPoints[0].x,
        y: this.controlPoints[0].y,
        pxWidth: 9,
        handleStyle: 'square',
        associatedShapeId: this.id,
        solid,
        reshaper: new NopReshaper(),
      }),
      new Handle({
        id: Shape.generateId(),
        x: this.controlPoints[lastPointIdx].x,
        y: this.controlPoints[lastPointIdx].y,
        pxWidth: 9,
        handleStyle: 'square',
        associatedShapeId: this.id,
        solid,
        reshaper: new NopReshaper(),
      }),
    ];
    return linkShapeArray(handles);
  }

  private calcBoundingBox(cp: Point[]): Rect {
    const emptyRect: Rect = { x: 0, y: 0, width: 0, height: 0 };
    if (this.controlPointCountInvalid(cp)) {
      return emptyRect;
    }
    const curveRects: Rect[] = [];
    for (let i = 3; i < cp.length; i += 3) {
      const xSpan = this.getCurveSpan(cp[i - 3].x, cp[i - 2].x, cp[i - 1].x, cp[i].x);
      const ySpan = this.getCurveSpan(cp[i - 3].y, cp[i - 2].y, cp[i - 1].y, cp[i].y);
      curveRects.push({
        x: xSpan.min,
        y: ySpan.min,
        width: xSpan.max - xSpan.min,
        height: ySpan.max - ySpan.min,
      });
    }
    return rectUnionArray(curveRects);
  }

  // Gives the span of the curve in one dimension (x or y)
  private getCurveSpan(p0: number, p1: number, p2: number, p3: number): Range {
    const i = p1 - p0;
    const j = p2 - p1;
    const k = p3 - p2;

    const a = 3 * i - 6 * j + 3 * k;
    const b = 6 * j - 6 * i;
    const c = 3 * i;

    const values: number[] = [p0, p3];
    const squaredExpression = b * b - 4 * a * c;
    if (squaredExpression < 0) {
      return { min: Math.min(...values), max: Math.max(...values) };
    }
    const e = Math.sqrt(squaredExpression);
    const t1 = (-b + e) / (2 * a);
    const t2 = (-b - e) / (2 * a);
    if (t1 >= 0 && t1 <= 1) {
      values.push(calcBezierValue(p0, p1, p2, p3, t1));
    }
    if (t2 >= 0 && t2 <= 1) {
      values.push(calcBezierValue(p0, p1, p2, p3, t2));
    }
    return { min: Math.min(...values), max: Math.max(...values) };
  }

  private drawFrame(c: CanvasRenderingContext2D, params: DrawingParams) {
    const { controlPoints: cp } = params;
    c.strokeStyle = 'lightgrey';
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(cp[0].x, cp[0].y);
    for (let i = 1; i < cp.length; i++) {
      c.lineTo(cp[i].x, cp[i].y);
    }
    c.stroke();
  }

  private drawCrosses(c: CanvasRenderingContext2D, params: DrawingParams) {
    const { controlPoints: cp } = params;
    c.strokeStyle = 'red';
    c.lineWidth = 1;
    c.beginPath();
    const size = 3;
    for (let i = 0; i < cp.length; i++) {
      const { x, y } = cp[i];
      c.moveTo(x - size, y - size);
      c.lineTo(x + size, y + size);
      c.moveTo(x - size, y + size);
      c.lineTo(x + size, y - size);
    }
    c.stroke();
  }

  private drawLabels(c: CanvasRenderingContext2D, params: DrawingParams) {
    const { controlPoints: cp } = params;
    c.fillStyle = 'black';
    c.font = '10px Arial';
    for (let i = 0; i < cp.length; i++) {
      const { x, y } = cp[i];
      c.fillText('P', x - 20, y);
      c.fillText(`${i}`, x - 13, y + 3);
    }
  }
}
