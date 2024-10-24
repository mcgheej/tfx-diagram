import { ColorMapRef } from '@tfx-diagram/diagram/data-access/color-classes';
import { TextBox } from '@tfx-diagram/diagram/data-access/text-classes';
import { inverseTransform, rectInflate } from '@tfx-diagram/diagram/util/misc-functions';
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
import { RectangleConnection } from '../../../../connections/derived-connections/rectangle-connection';
import { rectHighlightFrame } from '../../../../control-frames/rect-highlight-frame';
import { rectSelectFrame } from '../../../../control-frames/rect-select-frame';
import { checkLine, outsideDetectionRect } from '../../../../misc-functions';
import {
  AllShapeProps,
  RectangleConfig,
  RectangleProps,
  ShapeProps,
  SharedProperties,
} from '../../../../props';
import * as Reshapers from '../../../../reshapers';
import { LineAttachParams, RectangularReshapersConfig } from '../../../../types';
import { RectangleRadii } from '../../../../types/rectangle-radii.type';
import { Shape } from '../../../shape';
import { Group } from '../../../structural-shapes/group/group';
import { RectangleOutline } from '../../control-shapes/rectangle-outline/rectangle-outline';
import { BasicShape } from '../basic-shape';

interface PathOperation {
  opCode: 'moveTo' | 'lineTo' | 'arcTo' | 'rect';
  params: number[];
}

interface PathCache {
  t: Transform;
  operations: PathOperation[];
}

export const rectangleReshapersConfig: RectangularReshapersConfig = {
  nwReshaper: new Reshapers.RectangleNwReshaper(),
  nReshaper: new Reshapers.RectangleNReshaper(),
  neReshaper: new Reshapers.RectangleNeReshaper(),
  eReshaper: new Reshapers.RectangleEReshaper(),
  seReshaper: new Reshapers.RectangleSeReshaper(),
  sReshaper: new Reshapers.RectangleSReshaper(),
  swReshaper: new Reshapers.RectangleSwReshaper(),
  wReshaper: new Reshapers.RectangleWReshaper(),
};

const DEFAULT_X = 50;
const DEFAULT_Y = 50;
const DEFAULT_WIDTH = 40;
const DEFAULT_HEIGHT = 20;
export const rectangleDefaults: Omit<RectangleProps, keyof ShapeProps> = {
  x: DEFAULT_X,
  y: DEFAULT_Y,
  width: DEFAULT_WIDTH,
  height: DEFAULT_HEIGHT,
  corners: '20 0 20 10',
  lineDash: [],
  lineWidth: 0.5,
  strokeStyle: { colorSet: 'theme', ref: 'text1-3' },
  fillStyle: { colorSet: 'empty', ref: '' },
  textConfig: {},
};

type DrawingParams = Pick<RectangleProps, 'x' | 'y' | 'width' | 'height' | 'lineWidth'>;

const INITIAL_ATTACH_DISTANCE = 10000;

export class Rectangle extends BasicShape implements RectangleProps {
  static cachedPaths = new Map<string, PathCache>();
  static cachedShadowPaths = new Map<string, PathCache>();
  static deleteCaches(id: string) {
    Rectangle.cachedPaths.delete(id);
    Rectangle.cachedShadowPaths.delete(id);
  }

  x: number;
  y: number;
  width: number;
  height: number;
  lineDash: number[];
  lineWidth: number;
  corners: string;
  strokeStyle: ColorRef;
  fillStyle: ColorRef;
  textConfig: TextBoxConfig;

  private textBox: TextBox;
  // private cornerRadius: RectangleRadii;
  private computedCornerRadius: RectangleRadii;

  constructor(config: RectangleConfig) {
    super({ ...config, shapeType: 'rectangle', cursor: 'move' });
    this.x = config.x ?? rectangleDefaults.x;
    this.y = config.y ?? rectangleDefaults.y;
    this.width = config.width ?? rectangleDefaults.width;
    this.height = config.height ?? rectangleDefaults.height;
    this.corners = config.corners ?? rectangleDefaults.corners;
    this.lineDash = config.lineDash ?? rectangleDefaults.lineDash;
    this.lineWidth = config.lineWidth ?? rectangleDefaults.lineWidth;
    this.strokeStyle = config.strokeStyle ?? rectangleDefaults.strokeStyle;
    this.fillStyle = config.fillStyle ?? rectangleDefaults.fillStyle;
    this.textConfig = config.textConfig ?? rectangleDefaults.textConfig;
    this.textBox = new TextBox({ ...this.textConfig, id: this.id }, this.rect());

    // this.cornerRadius = [20, 0, 20, 10];
    this.computedCornerRadius = this.computeCornerRadii(this.corners);

    Rectangle.deleteCaches(this.id);
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
    // Get point in viewport coords and rectangle that bounds this
    // rectangle, including its edges (factor in line width), as need
    // to attach to outer limit of rectangle edge
    const p: Point = {
      x: t.scaleFactor * (point.x + t.transX),
      y: t.scaleFactor * (point.y + t.transY),
    };
    const { x: xT, y: yT, width: widthT, height: heightT, lineWidth } = this.getParams(t);
    const rectWithEdges = rectInflate(
      { x: xT, y: yT, width: widthT, height: heightT },
      lineWidth / 2
    );
    const { x, y, width, height } = rectWithEdges;

    // Check point is inside bounding rect expanded for detection threshold. If
    // not then no need to check if near rectangle boundary
    if (outsideDetectionRect(p, rectWithEdges)) {
      return undefined;
    }

    let attachParams: LineAttachParams = {
      index: 0,
      shortestDistance: INITIAL_ATTACH_DISTANCE,
      k: 0,
      connectionPoint: { x: 0, y: 0 },
    };
    attachParams = checkLine(0, p, { x, y }, { x: x + width, y }, attachParams);
    attachParams = checkLine(
      1,
      p,
      { x: x + width, y },
      { x: x + width, y: y + height },
      attachParams
    );
    attachParams = checkLine(
      2,
      p,
      { x: x + width, y: y + height },
      { x, y: y + height },
      attachParams
    );
    attachParams = checkLine(3, p, { x, y: y + height }, { x, y }, attachParams);
    if (attachParams.shortestDistance !== INITIAL_ATTACH_DISTANCE) {
      return new RectangleConnection({
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

  boundingBox(
    x: number = this.x,
    y: number = this.y,
    width: number = this.width,
    height: number = this.height
  ): Rect {
    return { x, y, width, height };
  }

  colors(): { lineColor: ColorRef; fillColor: ColorRef } {
    return {
      lineColor: this.strokeStyle,
      fillColor: this.fillStyle,
    };
  }

  copy(amendments: Partial<AllShapeProps>): Rectangle {
    const a = amendments as Partial<SharedProperties<RectangleProps, AllShapeProps>>;
    const aTextConfig = a.textConfig
      ? { ...this.textConfig, ...a.textConfig }
      : this.textConfig;
    const r = new Rectangle({
      id: a.id ?? this.id,
      prevShapeId: a.prevShapeId ?? this.prevShapeId,
      nextShapeId: a.nextShapeId ?? this.nextShapeId,
      groupId: a.groupId ?? this.groupId,
      cursor: a.cursor ?? this.cursor,
      selectable: a.selectable ?? this.selectable,
      visible: a.visible ?? this.visible,
      x: a.x ?? this.x,
      y: a.y ?? this.y,
      width: a.width ?? this.width,
      height: a.height ?? this.height,
      lineDash: a.lineDash ?? this.lineDash,
      lineWidth: a.lineWidth ?? this.lineWidth,
      corners: a.corners ?? this.corners,
      strokeStyle: a.strokeStyle ?? this.strokeStyle,
      fillStyle: a.fillStyle ?? this.fillStyle,
      textConfig: aTextConfig,
    } as RectangleProps);
    return r;
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
    this.drawRectangle(c, params, t);
    c.restore();
    this.textBox.draw(c, t, this.rect());
  }

  drawShadow(s: CanvasRenderingContext2D, t: Transform): void {
    if (!this.visible) {
      return;
    }
    const params = this.getParams(t);
    const { x, y, width, height } = params;
    let { lineWidth } = params;
    if (lineWidth < 1) {
      lineWidth = 1;
    }
    const inflationPx = lineWidth / 2 + 5;
    const rect = rectInflate({ x, y, width, height }, 5 + lineWidth / 2);
    const colour = '#' + (+this.id).toString(16);

    s.save();
    const pathOps = this.getCachedShadowPath(
      rect.x,
      rect.y,
      rect.width,
      rect.height,
      this.computedCornerRadius,
      t,
      inflationPx
    );
    s.fillStyle = colour;
    s.beginPath();
    executePathOperations(pathOps, s);
    s.fill();
    // s.strokeStyle = colour;
    // s.lineWidth = lineWidth + 15;
    // s.beginPath();
    // executePathOperations(pathOps, s);
    // s.stroke();
    s.restore();
  }

  getProps(): RectangleProps {
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
      width: this.width,
      height: this.height,
      corners: this.corners,
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
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
      },
      this.id,
      connections
    );
  }

  inspectorViewData(): ShapeInspectorData[] {
    return [
      { propName: 'x', value: this.x.toFixed(2) },
      { propName: 'y', value: this.y.toFixed(2) },
      { propName: 'width', value: this.width.toFixed(2) },
      { propName: 'height', value: this.height.toFixed(2) },
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
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
      }),
    ];
  }

  resizeToBox(r: Rect, resizeOption: ShapeResizeOptions): Rectangle {
    switch (resizeOption) {
      case 'widthOnly': {
        return this.copy({ width: r.width });
      }
      case 'heightOnly': {
        return this.copy({ height: r.height });
      }
    }
    return this.copy({ width: r.width, height: r.height });
  }

  rect(): Rect {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }

  selectFrame(shapes: Map<string, Shape>): Shape[] {
    if (this.groupId && shapes) {
      return Group.selectTopFrame(this.groupId, shapes);
    }
    return rectSelectFrame(
      { x: this.x, y: this.y, width: this.width, height: this.height },
      this.id,
      rectangleReshapersConfig
    );
  }

  text(): string {
    return this.textBox.text;
  }

  private drawRectangle(
    c: CanvasRenderingContext2D,
    params: DrawingParams,
    t: Transform
  ) {
    const { x, y, width, height } = params;
    let { lineWidth } = params;
    if (lineWidth < 1) {
      lineWidth = 1;
    }

    const s = ((1 + this.lineWidth / 0.25) / 2) * t.scaleFactor;
    const scaledLineDash = this.lineDash.map((dotDash) => {
      const scaledDotDash = dotDash * s;
      return scaledDotDash < 1 ? 1 : scaledDotDash;
    });

    const pathOps = this.getCachedPath(x, y, width, height, this.computedCornerRadius, t);

    const fillColor = ColorMapRef.resolve(this.fillStyle);
    if (fillColor) {
      c.fillStyle = fillColor;
      c.beginPath();
      executePathOperations(pathOps, c);
      c.fill();
    }
    const strokeColor = ColorMapRef.resolve(this.strokeStyle);
    if (strokeColor) {
      c.strokeStyle = strokeColor;
      c.lineWidth = lineWidth;
      c.setLineDash(scaledLineDash);
      c.beginPath();
      executePathOperations(pathOps, c);
      c.stroke();
    }
  }

  private getParams(t: Transform): DrawingParams {
    return {
      x: t.scaleFactor * (this.x + t.transX),
      y: t.scaleFactor * (this.y + t.transY),
      width: t.scaleFactor * this.width,
      height: t.scaleFactor * this.height,
      lineWidth: t.scaleFactor * this.lineWidth,
    };
  }

  private computeCornerRadii(corners: string): RectangleRadii {
    if (corners === '') {
      return [0, 0, 0, 0];
    }
    const r: RectangleRadii = [0, 0, 0, 0];
    const values = corners.split(' ');
    if (values.length > 4) {
      return r;
    }

    const cornerRadius: number[] = [];
    for (let i = 0; i < values.length; i++) {
      if (!/^0|[1-9]\d*$/.exec(values[i])) {
        return [0, 0, 0, 0];
      }
      cornerRadius.push(+values[i]);
    }

    if (cornerRadius.length === 1) {
      r[0] = cornerRadius[0];
      r[1] = r[0];
      r[2] = r[0];
      r[3] = r[0];
    } else if (cornerRadius.length === 2) {
      r[0] = cornerRadius[0];
      r[1] = cornerRadius[1];
      r[2] = r[0];
      r[3] = r[1];
    } else if (cornerRadius.length === 3) {
      r[0] = cornerRadius[0];
      r[1] = cornerRadius[1];
      r[2] = cornerRadius[2];
      r[3] = cornerRadius[1];
    } else if (cornerRadius.length > 3) {
      r[0] = cornerRadius[0];
      r[1] = cornerRadius[1];
      r[2] = cornerRadius[2];
      r[3] = cornerRadius[3];
    }
    let t = this.adjustSide(r[0], r[1], this.width);
    r[0] = t[0];
    r[1] = t[1];
    t = this.adjustSide(r[1], r[2], this.height);
    r[1] = t[0];
    r[2] = t[1];
    t = this.adjustSide(r[2], r[3], this.width);
    r[2] = t[0];
    r[3] = t[1];
    t = this.adjustSide(r[3], r[0], this.height);
    r[3] = t[0];
    r[0] = t[1];
    return r;
  }

  private adjustSide(r1: number, r2: number, sideLength: number): [number, number] {
    if (r1 + r2 <= sideLength) {
      return [r1, r2];
    }
    if (r1 === 0) {
      return [r1, sideLength];
    }
    if (r2 === 0) {
      return [sideLength, r2];
    }
    const modR1 = sideLength / (1 + r2 / r1);
    return [modR1, sideLength - modR1];
  }

  private getCachedPath(
    x: number,
    y: number,
    width: number,
    height: number,
    cornerRadii: RectangleRadii,
    transform: Transform
  ): PathOperation[] {
    const cachedPath = Rectangle.cachedPaths.get(this.id);
    if (
      cachedPath &&
      cachedPath.t.scaleFactor === transform.scaleFactor &&
      cachedPath.t.transX === transform.transX &&
      cachedPath.t.transY === transform.transY
    ) {
      return cachedPath.operations;
    }

    const operations = constructPath(x, y, width, height, cornerRadii, transform);
    Rectangle.cachedPaths.set(this.id, { t: transform, operations });
    return operations;
  }

  private getCachedShadowPath(
    x: number,
    y: number,
    width: number,
    height: number,
    cornerRadii: RectangleRadii,
    transform: Transform,
    inflationPx: number
  ): PathOperation[] {
    const cachedPath = Rectangle.cachedShadowPaths.get(this.id);
    if (
      cachedPath &&
      cachedPath.t.scaleFactor === transform.scaleFactor &&
      cachedPath.t.transX === transform.transX &&
      cachedPath.t.transY === transform.transY
    ) {
      return cachedPath.operations;
    }

    const operations = constructPath(
      x,
      y,
      width,
      height,
      cornerRadii,
      transform,
      inflationPx
    );
    Rectangle.cachedShadowPaths.set(this.id, { t: transform, operations });
    return operations;
  }
}

function executePathOperations(operations: PathOperation[], c: CanvasRenderingContext2D) {
  operations.map((p) => {
    switch (p.opCode) {
      case 'rect': {
        if (p.params.length === 4) {
          c.rect(p.params[0], p.params[1], p.params[2], p.params[3]);
        }
        break;
      }
      case 'moveTo': {
        if (p.params.length === 2) {
          c.moveTo(p.params[0], p.params[1]);
        }
        break;
      }
      case 'lineTo': {
        if (p.params.length === 2) {
          c.lineTo(p.params[0], p.params[1]);
        }
        break;
      }
      case 'arcTo': {
        if (p.params.length === 5) {
          c.arcTo(p.params[0], p.params[1], p.params[2], p.params[3], p.params[4]);
        }
        break;
      }
    }
  });
}

function constructPath(
  x: number,
  y: number,
  width: number,
  height: number,
  cornerRadii: RectangleRadii,
  transform: Transform,
  inflationPx = 0
): PathOperation[] {
  const r = transformRadii(cornerRadii, transform, inflationPx);

  // Recular rectangular with square corners
  if (allSquareCorners(r)) {
    return [{ opCode: 'rect', params: [x, y, width, height] }];
  }

  const ops: PathOperation[] = [];

  // Start position
  ops.push({ opCode: 'moveTo', params: r[0] === 0 ? [x, y] : [x + r[0], y] });

  // To end of top right corner
  if (r[1] === 0) {
    ops.push({ opCode: 'lineTo', params: [x + width, y] });
  } else {
    ops.push({ opCode: 'lineTo', params: [x + width - r[1], y] });
    ops.push({ opCode: 'arcTo', params: [x + width, y, x + width, y + r[1], r[1]] });
  }

  // To end of bottom right corner
  if (r[2] === 0) {
    ops.push({ opCode: 'lineTo', params: [x + width, y + height] });
  } else {
    ops.push({ opCode: 'lineTo', params: [x + width, y + height - r[2]] });
    ops.push({
      opCode: 'arcTo',
      params: [x + width, y + height, x + width - r[2], y + height, r[2]],
    });
  }

  // To end of bottom left corner
  if (r[3] === 0) {
    ops.push({ opCode: 'lineTo', params: [x, y + height] });
  } else {
    ops.push({ opCode: 'lineTo', params: [x + r[3], y + height] });
    ops.push({ opCode: 'arcTo', params: [x, y + height, x, y + height - r[3], r[3]] });
  }

  // To end of top left corner
  if (r[0] === 0) {
    ops.push({ opCode: 'lineTo', params: [x, y] });
  } else {
    ops.push({ opCode: 'lineTo', params: [x, y + r[0]] });
    ops.push({ opCode: 'arcTo', params: [x, y, x + r[0], y, r[0]] });
  }

  // And finish off line
  if (r[1] === 0) {
    ops.push({ opCode: 'lineTo', params: [x + width, y] });
  } else {
    ops.push({ opCode: 'lineTo', params: [x + width - r[1], y] });
  }
  return ops;
}

function allSquareCorners(radius: RectangleRadii): boolean {
  if (radius[0] !== 0 || radius[1] !== 0 || radius[2] !== 0 || radius[3] !== 0) {
    return false;
  }
  return true;
}

function transformRadii(
  cornerRadii: RectangleRadii,
  t: Transform,
  inflationPx: number
): RectangleRadii {
  return cornerRadii.map((r) => {
    const a = r * t.scaleFactor;
    return a >= 3 ? a + inflationPx : 0;
  }) as RectangleRadii;
}
