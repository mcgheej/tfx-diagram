import { ColorMapRef } from '@tfx-diagram/diagram/data-access/color-classes';
import { TextBox } from '@tfx-diagram/diagram/data-access/text-classes';
import {
  inverseTransform,
  pointAdd,
  pointTransform,
} from '@tfx-diagram/diagram/util/misc-functions';
import {
  ColorRef,
  Point,
  ShapeInspectorData,
  ShapeResizeOptions,
  TextBoxConfig,
  Transform,
} from '@tfx-diagram/electron-renderer-web/shared-types';
import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';
import { Connection } from '../../../../connections/connection';
import { TriangleConnection } from '../../../../connections/derived-connections/triangle-connection';
import { triangleHighlightFrame } from '../../../../control-frames/triangle-highlight-frame';
import { triangleSelectFrame } from '../../../../control-frames/triangle-select-frame';
import { lineInterpolate } from '../../../../misc-functions';
import {
  AllShapeProps,
  ShapeProps,
  SharedProperties,
  TriangleConfig,
  TriangleProps,
} from '../../../../props';
import { Shape } from '../../../shape';
import { Group } from '../../../structural-shapes/group';
import { RectangleOutline } from '../../control-shapes/shapes/rectangle-outline';
import { LineAttachParams, checkLine } from '../line-segment-attach-functions';
import { outsideDetectionRect } from '../rectangle/rectangle-attach-functions';

export const triangleDefaults: Omit<TriangleProps, keyof ShapeProps> = {
  vertices: [
    { x: 20, y: 10 },
    { x: 30, y: 20 },
    { x: 10, y: 20 },
  ],
  lineDash: [],
  lineWidth: 0.5,
  strokeStyle: { colorSet: 'theme', ref: 'text1-3' },
  fillStyle: { colorSet: 'empty', ref: '' },
  textConfig: {},
};

type DrawingParams = Pick<TriangleProps, 'vertices' | 'lineWidth'>;

const INITIAL_ATTACH_DISTANCE = 10000;

export class Triangle extends Shape implements TriangleProps {
  vertices: [Point, Point, Point];
  lineDash: number[];
  lineWidth: number;
  strokeStyle: ColorRef;
  fillStyle: ColorRef;
  textConfig: TextBoxConfig;

  private textBox: TextBox;

  constructor(config: TriangleConfig) {
    super({ ...config, shapeType: 'triangle', cursor: 'move' });
    this.vertices = config.vertices ?? [...triangleDefaults.vertices];
    this.lineDash = config.lineDash ?? triangleDefaults.lineDash;
    this.lineWidth = config.lineWidth ?? triangleDefaults.lineWidth;
    this.strokeStyle = config.strokeStyle ?? triangleDefaults.strokeStyle;
    this.fillStyle = config.fillStyle ?? triangleDefaults.fillStyle;
    this.textConfig = config.textConfig ?? triangleDefaults.textConfig;
    this.textBox = new TextBox({ ...this.textConfig, id: this.id }, this.rect());
  }

  anchor(): Point {
    return {
      x: this.vertices[0].x,
      y: this.vertices[0].y,
    };
  }

  attachBoundary(
    point: Point,
    t: Transform,
    connectionHook: Connection
  ): Connection | undefined {
    const p: Point = {
      x: t.scaleFactor * (point.x + t.transX),
      y: t.scaleFactor * (point.y + t.transY),
    };
    const { vertices } = this.getParams(t);

    // Check point is inside bounding rect expanded for detection threshold. If
    // not then no need to check if near rectangle boundary
    if (outsideDetectionRect(p, this.rect(vertices))) {
      return undefined;
    }

    let attachParams: LineAttachParams = {
      index: 0,
      shortestDistance: INITIAL_ATTACH_DISTANCE,
      k: 0,
      connectionPoint: { x: 0, y: 0 },
    };
    attachParams = checkLine(0, p, vertices[0], vertices[1], attachParams);
    attachParams = checkLine(1, p, vertices[1], vertices[2], attachParams);
    attachParams = checkLine(2, p, vertices[2], vertices[0], attachParams);
    if (attachParams.shortestDistance !== INITIAL_ATTACH_DISTANCE) {
      return new TriangleConnection({
        id: connectionHook.id,
        connectorId: connectionHook.connectorId,
        end: connectionHook.end,
        shapeId: this.id,
        connectionPoint: inverseTransform(attachParams.connectionPoint, t),
        index: attachParams.index,
        k: attachParams.k,
      });
    }
    return undefined;
  }

  boundingBox(): Rect {
    return this.rect();
  }

  colors(): { lineColor: ColorRef; fillColor: ColorRef } {
    return {
      lineColor: this.strokeStyle,
      fillColor: this.fillStyle,
    };
  }

  copy(amendments: Partial<AllShapeProps>): Triangle {
    const a = amendments as Partial<SharedProperties<TriangleProps, AllShapeProps>>;
    const aTextConfig = a.textConfig
      ? { ...this.textConfig, ...a.textConfig }
      : this.textConfig;
    const t = new Triangle({
      id: a.id ?? this.id,
      prevShapeId: a.prevShapeId ?? this.prevShapeId,
      nextShapeId: a.nextShapeId ?? this.nextShapeId,
      groupId: a.groupId ?? this.groupId,
      cursor: a.cursor ?? this.cursor,
      selectable: a.selectable ?? this.selectable,
      visible: a.visible ?? this.visible,
      vertices: a.vertices ?? this.vertices,
      strokeStyle: a.strokeStyle ?? this.strokeStyle,
      fillStyle: a.fillStyle ?? this.fillStyle,
      lineDash: a.lineDash ?? this.lineDash,
      lineWidth: a.lineWidth ?? this.lineWidth,
      textConfig: aTextConfig,
    } as TriangleProps);
    return t;
  }

  dragOffset(mousePagePos: Point): Point {
    return {
      x: mousePagePos.x - this.vertices[0].x,
      y: mousePagePos.y - this.vertices[0].y,
    };
  }

  draw(c: CanvasRenderingContext2D, t: Transform): void {
    const params = this.getParams(t);
    const { vertices } = this.getParams(t);
    let { lineWidth: pxLineWidth } = params;
    if (pxLineWidth < 2) {
      pxLineWidth = 2;
    }
    pxLineWidth = pxLineWidth * 2;
    c.save();
    const strokeColor = ColorMapRef.resolve(this.strokeStyle);
    const fillColor = ColorMapRef.resolve(this.fillStyle);
    this.drawTriangle(c, vertices, pxLineWidth, strokeColor, fillColor, t);
    c.restore();
    this.textBox.draw(c, t, this.rect());
  }

  drawShadow(s: CanvasRenderingContext2D, t: Transform): void {
    if (!this.visible) {
      return;
    }
    const params = this.getParams(t);
    const { vertices } = params;
    let { lineWidth: lineWidthPx } = params;
    if (lineWidthPx < 2) {
      lineWidthPx = 2;
    }
    const colour = '#' + (+this.id).toString(16);
    s.save();
    this.drawTriangle(s, vertices, 10, colour, colour, t, true);
    s.restore();
  }

  getProps(): TriangleProps {
    return {
      id: this.id,
      prevShapeId: this.prevShapeId,
      nextShapeId: this.nextShapeId,
      groupId: this.groupId,
      shapeType: this.shapeType,
      cursor: this.cursor,
      selectable: this.selectable,
      visible: this.visible,
      vertices: this.vertices,
      strokeStyle: this.strokeStyle,
      fillStyle: this.fillStyle,
      lineDash: this.lineDash,
      lineWidth: this.lineWidth,
      textConfig: this.textConfig,
    };
  }

  highLightFrame(shapes: Map<string, Shape>): Shape[] {
    if (this.groupId && shapes) {
      return Group.highlightTopFrame(this.groupId, shapes);
    }
    return triangleHighlightFrame(this.vertices, this.id);
  }

  inspectorViewData(): ShapeInspectorData[] {
    return [
      {
        propName: 'point 1',
        value: `(${this.vertices[0].x.toFixed(2)}, ${this.vertices[0].y.toFixed(2)})`,
      },
      {
        propName: 'point 2',
        value: `(${this.vertices[1].x.toFixed(2)}, ${this.vertices[1].y.toFixed(2)})`,
      },
      {
        propName: 'point 3',
        value: `(${this.vertices[2].x.toFixed(2)}, ${this.vertices[2].y.toFixed(2)})`,
      },
    ];
  }

  move(shiftDelta: Point): Shape {
    return this.copy({
      vertices: [
        pointAdd(this.vertices[0], shiftDelta),
        pointAdd(this.vertices[1], shiftDelta),
        pointAdd(this.vertices[2], shiftDelta),
      ],
    });
  }

  outlineShapes(): Shape[] {
    const r = this.rect();
    return [
      new RectangleOutline({
        id: Shape.generateId(),
        x: r.x,
        y: r.y,
        width: r.width,
        height: r.height,
      }),
    ];
  }

  resizeToBox(r: Rect, resizeOption: ShapeResizeOptions): Shape {
    const newVertices: Point[] = [];
    const b = this.boundingBox();
    this.vertices.map((cp) => {
      const x =
        resizeOption === 'heightOnly' ? cp.x : ((cp.x - b.x) * r.width) / b.width + b.x;
      const y =
        resizeOption === 'widthOnly' ? cp.y : ((cp.y - b.y) * r.height) / b.height + b.y;
      newVertices.push({ x, y });
    });
    return this.copy({ vertices: [newVertices[0], newVertices[1], newVertices[2]] });
  }

  rect(vertices: [Point, Point, Point] = this.vertices): Rect {
    let maxX = -10000;
    let maxY = -10000;
    let minX = 10000;
    let minY = 10000;
    for (let i = 0; i < 3; i++) {
      if (vertices[i].x > maxX) {
        maxX = vertices[i].x;
      }
      if (vertices[i].y > maxY) {
        maxY = vertices[i].y;
      }
      if (vertices[i].x < minX) {
        minX = vertices[i].x;
      }
      if (vertices[i].y < minY) {
        minY = vertices[i].y;
      }
    }
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  selectFrame(shapes: Map<string, Shape>): Shape[] {
    if (this.groupId && shapes) {
      return Group.selectTopFrame(this.groupId, shapes);
    }
    return triangleSelectFrame(this.vertices, this.id);
  }

  text(): string {
    return this.textBox.text;
  }

  private drawTriangle(
    c: CanvasRenderingContext2D,
    v: [Point, Point, Point],
    lineWidthPx: number,
    strokeColor: string,
    fillColor: string,
    t: Transform,
    shadow = false
  ) {
    if (fillColor) {
      c.fillStyle = fillColor;
      c.beginPath();
      c.moveTo(v[0].x, v[0].y);
      c.lineTo(v[1].x, v[1].y);
      c.lineTo(v[2].x, v[2].y);
      c.fill();
    }
    if (strokeColor) {
      c.strokeStyle = strokeColor;
      c.lineWidth = lineWidthPx;

      if (!shadow) {
        const s = ((1 + this.lineWidth / 0.25) / 2) * t.scaleFactor;
        const scaledLineDash = this.lineDash.map((dotDash) => {
          const scaledDotDash = dotDash * s;
          return scaledDotDash < 1 ? 1 : scaledDotDash;
        });
        c.setLineDash(scaledLineDash);
      }

      const v3 = lineInterpolate(v[0], v[1], 0.01);
      if (!shadow) {
        c.beginPath();
        this.drawTriangleLines(c, v, v3);
        c.clip();
      }
      c.beginPath();
      this.drawTriangleLines(c, v, v3);
      c.stroke();
    }
  }

  private drawTriangleLines(
    c: CanvasRenderingContext2D,
    v: [Point, Point, Point],
    v3: Point
  ) {
    c.moveTo(v[0].x, v[0].y);
    c.lineTo(v[1].x, v[1].y);
    c.lineTo(v[2].x, v[2].y);
    c.lineTo(v[0].x, v[0].y);
    c.lineTo(v3.x, v3.y);
  }

  private getParams(t: Transform): DrawingParams {
    return {
      vertices: [
        pointTransform(this.vertices[0], t),
        pointTransform(this.vertices[1], t),
        pointTransform(this.vertices[2], t),
      ],
      lineWidth: t.scaleFactor * this.lineWidth,
    };
  }
}
