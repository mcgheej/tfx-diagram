/* eslint-disable @typescript-eslint/no-unused-vars */
import { ColorMapRef } from '@tfx-diagram/diagram/data-access/color-classes';
import {
  ColorRef,
  Point,
  ShapeInspectorData,
  ShapeResizeOptions,
  Transform,
} from '@tfx-diagram/electron-renderer-web/shared-types';
import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';
import { Connection } from '../../../../connections/connection';
import { arcSelectFrame } from '../../../../control-frames/arc-select-frame';
import {
  calcArcBoundingBox,
  getArcEndpoints,
  linkShapeArray,
} from '../../../../misc-functions';
import {
  AllShapeProps,
  ArcConfig,
  ArcProps,
  ShapeProps,
  SharedProperties,
} from '../../../../props';
import { NopReshaper } from '../../../../reshapers/reshaper';
import { Shape } from '../../../shape';
import { Group } from '../../../structural-shapes/group';
import { Handle } from '../../control-shapes/handle/handle';
import { RectangleOutline } from '../../control-shapes/rectangle-outline/rectangle-outline';
import { BasicShape } from '../basic-shape';

export const arcDefaults: Omit<ArcProps, keyof ShapeProps> = {
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

export class Arc extends BasicShape implements ArcProps {
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
    this.sAngle = (config.sAngle ?? arcDefaults.sAngle) % 360;
    this.eAngle = (config.eAngle ?? arcDefaults.eAngle) % 360;
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

  boundingBox(): Rect {
    return calcArcBoundingBox(this);
  }

  colors(): { lineColor: ColorRef; fillColor: ColorRef } {
    return {
      lineColor: this.strokeStyle,
      fillColor: this.fillStyle,
    };
  }

  copy(amendments: Partial<AllShapeProps>): Arc {
    const a = amendments as Partial<SharedProperties<ArcProps, AllShapeProps>>;
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
      sAngle: (a.sAngle ?? this.sAngle) % 360,
      eAngle: (a.eAngle ?? this.eAngle) % 360,
      circleSegment: a.circleSegment ?? this.circleSegment,
      strokeStyle: a.strokeStyle ?? this.strokeStyle,
      fillStyle: a.fillStyle ?? this.fillStyle,
      lineDash: a.lineDash ?? this.lineDash,
      lineWidth: a.lineWidth ?? this.lineWidth,
    } as ArcProps);
    return s;
  }
  // copy(amendments: Partial<ArcProps>): Arc {
  //   const a = amendments;
  //   const s = new Arc({
  //     id: a.id ?? this.id,
  //     prevShapeId: a.prevShapeId ?? this.prevShapeId,
  //     nextShapeId: a.nextShapeId ?? this.nextShapeId,
  //     cursor: a.cursor ?? this.cursor,
  //     groupId: a.groupId ?? this.groupId,
  //     selectable: a.selectable ?? this.selectable,
  //     visible: a.visible ?? this.visible,
  //     x: a.x ?? this.x,
  //     y: a.y ?? this.y,
  //     radius: a.radius ?? this.radius,
  //     sAngle: (a.sAngle ?? this.sAngle) % 360,
  //     eAngle: (a.eAngle ?? this.eAngle) % 360,
  //     circleSegment: a.circleSegment ?? this.circleSegment,
  //     strokeStyle: a.strokeStyle ?? this.strokeStyle,
  //     fillStyle: a.fillStyle ?? this.fillStyle,
  //     lineDash: a.lineDash ?? this.lineDash,
  //     lineWidth: a.lineWidth ?? this.lineWidth,
  //   } as ArcProps);
  //   return s;
  // }

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

  drawShadow(s: CanvasRenderingContext2D, t: Transform): void {
    if (!this.visible) {
      return;
    }
    const params = this.getParams(t);
    s.save();
    this.drawArcShadow(s, params, t);
    s.restore();
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

  highLightFrame(shapes: Map<string, Shape>): Shape[] {
    if (this.groupId && shapes) {
      return Group.highlightTopFrame(this.groupId, shapes);
    }
    return this.arcHighlightHandles();
  }

  inspectorViewData(): ShapeInspectorData[] {
    return [
      { propName: 'x', value: this.x.toFixed(2) },
      { propName: 'y', value: this.y.toFixed(2) },
      { propName: 'radius', value: this.radius.toFixed(2) },
      { propName: 'sAngle', value: this.sAngle.toFixed(2) },
      { propName: 'eAngle', value: this.eAngle.toFixed(2) },
      { propName: 'solid', value: this.circleSegment.toString() },
    ];
  }

  move(shiftDelta: Point): Shape {
    return this.copy({
      x: this.x + shiftDelta.x,
      y: this.y + shiftDelta.y,
    });
  }

  outlineShapes(): Shape[] {
    // return this.endpointHandles();
    const b = calcArcBoundingBox(this);
    return [
      new RectangleOutline({
        id: Shape.generateId(),
        x: b.x,
        y: b.y,
        width: b.width,
        height: b.height,
      }),
    ];
  }

  // Makes no sense to resize an arc to a box so leave unchanged.
  resizeToBox(r: Rect, resizeOption: ShapeResizeOptions): Arc {
    return this.copy({});
  }

  selectFrame(shapes: Map<string, Shape>): Shape[] {
    if (this.groupId && shapes) {
      return Group.selectTopFrame(this.groupId, shapes);
    }
    return arcSelectFrame(this);
  }

  text(): string {
    return '';
  }

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

  private drawArcShadow(
    c: CanvasRenderingContext2D,
    params: DrawingParams,
    t: Transform
  ) {
    const { x, y } = params;
    let { lineWidth, radius } = params;
    lineWidth = Math.max(lineWidth, 2);
    lineWidth += 5;
    radius = Math.max(radius, 3);
    const color = '#' + (+this.id).toString(16);
    if (this.circleSegment) {
      c.fillStyle = color;
      c.beginPath();
      c.moveTo(x, y);
      c.arc(x, y, radius, (this.sAngle * Math.PI) / 180, (this.eAngle * Math.PI) / 180);
      c.lineTo(x, y);
      c.fill();
    } else {
      c.strokeStyle = color;
      c.lineWidth = lineWidth;
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
      lineWidth: t.scaleFactor * this.lineWidth,
    };
  }

  private arcHighlightHandles(): Shape[] {
    const { a, b } = getArcEndpoints(
      this.x,
      this.y,
      this.radius,
      this.sAngle,
      this.eAngle
    );
    let controlFrame: Shape[] = [
      new Handle({
        id: Shape.generateId(),
        x: a.x,
        y: a.y,
        fillStyle: { colorSet: 'standard', ref: '1' },
        pxWidth: 9,
        associatedShapeId: this.id,
        reshaper: new NopReshaper(),
      }),
      new Handle({
        id: Shape.generateId(),
        x: b.x,
        y: b.y,
        fillStyle: { colorSet: 'standard', ref: '1' },
        pxWidth: 9,
        associatedShapeId: this.id,
        reshaper: new NopReshaper(),
      }),
    ];
    if (this.circleSegment) {
      controlFrame.push(
        new Handle({
          id: Shape.generateId(),
          x: this.x,
          y: this.y,
          fillStyle: { colorSet: 'standard', ref: '1' },
          pxWidth: 9,
          associatedShapeId: this.id,
          reshaper: new NopReshaper(),
        })
      );
    }
    controlFrame = linkShapeArray(controlFrame);
    return controlFrame;
  }
}
