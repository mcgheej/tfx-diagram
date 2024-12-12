import { ColorMapRef } from '@tfx-diagram/diagram/data-access/color-classes';
import { TextBox } from '@tfx-diagram/diagram/data-access/text-classes';
import { pointTransform, rectInflate } from '@tfx-diagram/diagram/util/misc-functions';
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
import { rectHighlightFrame } from '../../../../control-frames/rect-highlight-frame';
import { rectSelectFrame } from '../../../../control-frames/rect-select-frame';
import { attachRectangle } from '../../../../misc-functions/rectangle-attach-functions/attach-rectangle';
import {
  AllShapeProps,
  RectangleConfig,
  RectangleProps,
  ShapeProps,
  SharedProperties,
} from '../../../../props';
import * as Reshapers from '../../../../reshapers';
import {
  PathOperation,
  RectangleSegment,
  RectangularReshapersConfig,
} from '../../../../types';
import { RectangleRadii } from '../../../../types/rectangle-radii.type';
import { Shape } from '../../../shape';
import { Group } from '../../../structural-shapes/group/group';
import { RectangleOutline } from '../../control-shapes/rectangle-outline/rectangle-outline';
import { BasicShape } from '../basic-shape';
import {
  computeCornerRadii,
  constructPath,
  constructSegments,
  executePathOperations,
} from './support-functions';

interface RectanglePathData {
  t: Transform;
  drawOperations: PathOperation[];
  shadowDrawOperations: PathOperation[];
  perimiter: RectangleSegment[];
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
  corners: '0',
  lineDash: [],
  lineWidth: 0.5,
  strokeStyle: { colorSet: 'theme', ref: 'text1-3' },
  fillStyle: { colorSet: 'empty', ref: '' },
  textConfig: {},
};

type DrawingParams = Pick<RectangleProps, 'x' | 'y' | 'width' | 'height' | 'lineWidth'>;

export class Rectangle extends BasicShape implements RectangleProps {
  static cachedPathData = new Map<string, RectanglePathData>();
  static deleteCacheEntry(id: string) {
    Rectangle.cachedPathData.delete(id);
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

    this.computedCornerRadius = computeCornerRadii(this.corners, this.width, this.height);
    const tempTransform: Transform = {
      transX: 0,
      transY: 0,
      scaleFactor: 8,
    };
    this.getCachedPathData(this.getParams(tempTransform), tempTransform);

    // Rectangle.deleteCacheEntry(this.id);
  }

  anchor(): Point {
    return {
      x: this.x,
      y: this.y,
    };
  }

  attachBoundary(
    mousePos: Point,
    t: Transform,
    connectionHook: Connection,
  ): Connection | undefined {
    // Get the coordinates of the mouse position in viewport coords.
    const mousePosPx = pointTransform(mousePos, t);

    // Get the rectangle in viewport coords (pixels) and the line width
    // in pixels
    const { x, y, width, height, lineWidth } = this.getParams(t);

    return attachRectangle(
      mousePosPx,
      { x, y, width, height },
      lineWidth,
      this.id,
      connectionHook,
      t,
    );
  }

  boundingBox(
    x: number = this.x,
    y: number = this.y,
    width: number = this.width,
    height: number = this.height,
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
    const colour = '#' + (+this.id).toString(16);

    const params = this.getParams(t);
    const { shadowDrawOperations: pathOps } = this.getCachedPathData(params, t);
    s.save();
    s.fillStyle = colour;
    s.beginPath();
    executePathOperations(pathOps, s);
    s.fill();
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
    ignoreGroup = false,
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
      connections,
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
      rectangleReshapersConfig,
    );
  }

  text(): string {
    return this.textBox.text;
  }

  private drawRectangle(
    c: CanvasRenderingContext2D,
    params: DrawingParams,
    t: Transform,
  ) {
    let { lineWidth } = params;
    if (lineWidth < 1) {
      lineWidth = 1;
    }

    const s = ((1 + this.lineWidth / 0.25) / 2) * t.scaleFactor;
    const scaledLineDash = this.lineDash.map((dotDash) => {
      const scaledDotDash = dotDash * s;
      return scaledDotDash < 1 ? 1 : scaledDotDash;
    });

    const { drawOperations: pathOps } = this.getCachedPathData(params, t);

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

  private getCachedPathData(
    params: DrawingParams,
    t: Transform,
  ): {
    drawOperations: PathOperation[];
    shadowDrawOperations: PathOperation[];
  } {
    const cachedPath = Rectangle.cachedPathData.get(this.id);
    if (
      cachedPath &&
      cachedPath.t.scaleFactor === t.scaleFactor &&
      cachedPath.t.transX === t.transX &&
      cachedPath.t.transY === t.transY
    ) {
      return {
        drawOperations: cachedPath.drawOperations,
        shadowDrawOperations: cachedPath.shadowDrawOperations,
      };
    }

    const { x, y, width, height } = params;
    let { lineWidth } = params;
    if (lineWidth < 1) {
      lineWidth = 1;
    }
    const inflationPx = lineWidth / 2 + 5;
    const shadowRect = rectInflate({ x, y, width, height }, inflationPx);

    const drawOperations = constructPath(
      x,
      y,
      width,
      height,
      this.computedCornerRadius,
      t,
    );
    const shadowDrawOperations = constructPath(
      shadowRect.x,
      shadowRect.y,
      shadowRect.width,
      shadowRect.height,
      this.computedCornerRadius,
      t,
      inflationPx,
    );
    const perimiter = constructSegments(
      this.x,
      this.y,
      this.width,
      this.height,
      this.computedCornerRadius,
      t,
      this.lineWidth / 2,
    );

    Rectangle.cachedPathData.set(this.id, {
      t,
      drawOperations,
      shadowDrawOperations,
      perimiter,
    });
    return { drawOperations, shadowDrawOperations };
  }
}
