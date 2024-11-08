import { ColorMapRef } from '@tfx-diagram/diagram/data-access/color-classes';
import { TextBox } from '@tfx-diagram/diagram/data-access/text-classes';
import {
  inverseTransform,
  pointInRect,
  pointTransform,
  rectInflate,
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
import { CircleConnection } from '../../../../connections/derived-connections/circle-connection';
import { rectHighlightFrame } from '../../../../control-frames/rect-highlight-frame';
import { rectSelectFrame } from '../../../../control-frames/rect-select-frame';
import {
  AllShapeProps,
  CircleConfig,
  CircleProps,
  ShapeProps,
  SharedProperties,
} from '../../../../props';
import * as Reshapers from '../../../../reshapers';
import {
  PX_BOUNDARY_DETECTION_THRESHOLD,
  RectangularReshapersConfig,
} from '../../../../types';
import { Shape } from '../../../shape';
import { Group } from '../../../structural-shapes/group/group';
import { RectangleOutline } from '../../control-shapes/rectangle-outline/rectangle-outline';
import { BasicShape } from '../basic-shape';

export const circleReshapersConfig: RectangularReshapersConfig = {
  nwReshaper: new Reshapers.CircleNwReshaper(),
  nReshaper: new Reshapers.CircleNReshaper(),
  neReshaper: new Reshapers.CircleNeReshaper(),
  eReshaper: new Reshapers.CircleEReshaper(),
  seReshaper: new Reshapers.CircleSeReshaper(),
  sReshaper: new Reshapers.CircleSReshaper(),
  swReshaper: new Reshapers.CircleSwReshaper(),
  wReshaper: new Reshapers.CircleWReshaper(),
};

const circleDefaults: Omit<CircleProps, keyof ShapeProps> = {
  x: 50,
  y: 50,
  radius: 25,
  lineDash: [],
  lineWidth: 0.5,
  strokeStyle: { colorSet: 'theme', ref: 'text1-3' },
  fillStyle: { colorSet: 'empty', ref: '' },
  textConfig: {},
};

type DrawingParams = Pick<CircleProps, 'x' | 'y' | 'radius' | 'lineWidth'>;

export class Circle extends BasicShape implements CircleProps {
  x: number;
  y: number;
  radius: number;
  lineDash: number[];
  lineWidth: number;
  strokeStyle: ColorRef;
  fillStyle: ColorRef;
  textConfig: TextBoxConfig;

  private textBox: TextBox;

  constructor(config: CircleConfig) {
    super({ ...config, shapeType: 'circle', cursor: 'move' });
    this.x = config.x ?? circleDefaults.x;
    this.y = config.y ?? circleDefaults.y;
    this.radius = config.radius ?? circleDefaults.radius;
    this.lineDash = config.lineDash ?? circleDefaults.lineDash;
    this.lineWidth = config.lineWidth ?? circleDefaults.lineWidth;
    this.strokeStyle = config.strokeStyle ?? circleDefaults.strokeStyle;
    this.fillStyle = config.fillStyle ?? circleDefaults.fillStyle;
    this.textConfig = config.textConfig ?? circleDefaults.textConfig;
    this.textBox = new TextBox({ ...this.textConfig, id: this.id }, this.rect());
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
    const p = pointTransform(point, t);
    const { x, y, lineWidth, radius: r } = this.getParams(t);
    const radius = r + lineWidth / 2;

    // Check point is inside bounding rect expanded for detection threshold. If
    // not then no need to check if near circle circumference
    if (
      !pointInRect(
        p,
        rectInflate(this.boundingBox(x, y, radius), PX_BOUNDARY_DETECTION_THRESHOLD)
      )
    ) {
      return undefined;
    }

    const d = Math.sqrt((p.x - x) ** 2 + (p.y - y) ** 2) - radius;
    if (Math.abs(d) > PX_BOUNDARY_DETECTION_THRESHOLD) {
      return undefined;
    }
    const v: [number, number] = [p.x - x, p.y - y];
    const magV = Math.sqrt(v[0] ** 2 + v[1] ** 2);
    const u: [number, number] = [v[0] / magV, v[1] / magV];
    const result: Point = {
      x: x + u[0] * radius,
      y: y + u[1] * radius,
    };
    return new CircleConnection({
      id: connectionHook.id,
      connectorId: connectionHook.connectorId,
      end: connectionHook.end,
      shapeId: this.id,
      connectionPoint: inverseTransform(result, t),
      normalisedVector: { x: u[0], y: u[1] },
    });
  }

  boundingBox(
    x: number = this.x,
    y: number = this.y,
    radius: number = this.radius
  ): Rect {
    return {
      x: x - radius,
      y: y - radius,
      width: radius * 2,
      height: radius * 2,
    } as Rect;
  }

  colors(): { lineColor: ColorRef; fillColor: ColorRef } {
    return {
      lineColor: this.strokeStyle,
      fillColor: this.fillStyle,
    };
  }

  copy(amendments: Partial<AllShapeProps>): Circle {
    const a = amendments as Partial<SharedProperties<CircleProps, AllShapeProps>>;
    const aTextConfig = a.textConfig
      ? { ...this.textConfig, ...a.textConfig }
      : this.textConfig;
    const c = new Circle({
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
      strokeStyle: a.strokeStyle ?? this.strokeStyle,
      fillStyle: a.fillStyle ?? this.fillStyle,
      lineDash: a.lineDash ?? this.lineDash,
      lineWidth: a.lineWidth ?? this.lineWidth,
      textConfig: aTextConfig,
    } as CircleProps);
    return c;
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
    this.drawCircle(c, params, t);
    c.restore();
    this.textBox.draw(c, t, this.rect());
  }

  /**
   *
   * @param s canvas context for shadow canvas
   * @param t current page window to viewport mapping transformation
   *
   * Method to draw shadow of circle in shadow canvas. Colour used
   * is derived from the unique shape id. The size of shadow is slightly
   * larger than the shape itself. This helps with identifying the shape
   * under the current mouse position (antialiasing problem)
   */
  drawShadow(s: CanvasRenderingContext2D, t: Transform): void {
    if (!this.visible) {
      return;
    }
    const params = this.getParams(t);
    const { x, y, lineWidth } = params;
    let { radius } = params;
    if (radius < 3) {
      radius = 3;
    }
    radius += 5 + lineWidth / 2;
    const colour = '#' + (+this.id).toString(16);
    s.save();
    s.fillStyle = colour;
    s.beginPath();
    s.arc(x, y, radius, 0, 2 * Math.PI);
    s.fill();
    s.restore();
  }

  getProps(): CircleProps {
    return {
      id: this.id,
      prevShapeId: this.prevShapeId,
      nextShapeId: this.nextShapeId,
      groupId: this.groupId,
      shapeType: this.shapeType,
      cursor: this.cursor,
      selectable: this.selectable,
      visible: this.visible,
      x: this.x,
      y: this.y,
      radius: this.radius,
      strokeStyle: this.strokeStyle,
      fillStyle: this.fillStyle,
      lineDash: this.lineDash,
      lineWidth: this.lineWidth,
      textConfig: this.textConfig,
    };
  }

  highLightFrame(
    shapes: Map<string, Shape>,
    connections: Map<string, Connection>,
    ignoreGroup = false
  ): Shape[] {
    if (this.groupId && shapes && !ignoreGroup) {
      return Group.highlightTopFrame(this.groupId, shapes, connections);
    }
    return rectHighlightFrame(
      {
        x: this.x - this.radius,
        y: this.y - this.radius,
        width: this.radius * 2,
        height: this.radius * 2,
      },
      this.id,
      connections
    );
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

  outlineShapes(): Shape[] {
    return [
      new RectangleOutline({
        id: Shape.generateId(),
        x: this.x - this.radius,
        y: this.y - this.radius,
        width: this.radius * 2,
        height: this.radius * 2,
      }),
    ];
  }

  resizeToBox(r: Rect, resizeOption: ShapeResizeOptions): Circle {
    switch (resizeOption) {
      case 'widthOnly': {
        return this.copy({ radius: r.width / 2 });
      }
      case 'heightOnly': {
        return this.copy({ radius: r.height / 2 });
      }
    }
    return this.copy({ radius: Math.min(r.width, r.height) / 2 });
  }

  rect(): Rect {
    const size = this.radius * 2;
    return {
      x: this.x - this.radius,
      y: this.y - this.radius,
      width: size,
      height: size,
    };
  }

  selectFrame(shapes: Map<string, Shape>): Shape[] {
    if (this.groupId && shapes) {
      return Group.selectTopFrame(this.groupId, shapes);
    }
    return rectSelectFrame(
      {
        x: this.x - this.radius,
        y: this.y - this.radius,
        width: this.radius * 2,
        height: this.radius * 2,
      },
      this.id,
      circleReshapersConfig
    );
  }

  text(): string {
    return this.textBox.text;
  }

  private drawCircle(c: CanvasRenderingContext2D, params: DrawingParams, t: Transform) {
    const { x, y } = params;
    let { lineWidth, radius } = params;
    if (lineWidth < 1) {
      lineWidth = 1;
    }
    if (radius < 3) {
      radius = 3;
    }
    const s = ((1 + this.lineWidth / 0.25) / 2) * t.scaleFactor;
    const scaledLineDash = this.lineDash.map((dotDash) => {
      const scaledDotDash = dotDash * s;
      return scaledDotDash < 1 ? 1 : scaledDotDash;
    });
    const fillColor = ColorMapRef.resolve(this.fillStyle);
    if (fillColor) {
      c.fillStyle = fillColor;
      c.beginPath();
      c.arc(x, y, radius, 0, 2 * Math.PI);
      c.fill();
    }

    const strokeColor = ColorMapRef.resolve(this.strokeStyle);
    if (strokeColor) {
      // c.beginPath();
      // c.lineWidth = 1;
      // c.arc(x, y, radius + 1, 0, 2 * Math.PI);
      // c.clip();
      c.strokeStyle = strokeColor;
      c.lineWidth = lineWidth;
      c.setLineDash(scaledLineDash);
      c.beginPath();
      c.arc(x, y, radius, 0, 2 * Math.PI);
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
      lineWidth: t.scaleFactor * this.lineWidth,
    } as DrawingParams;
  }
}
