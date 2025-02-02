import { ColorMapRef } from '@tfx-diagram/diagram/data-access/color-classes';
import {
  pointAdd,
  pointTransform,
  rectInflate,
  rectNormalised,
  rectUnionArray,
} from '@tfx-diagram/diagram/util/misc-functions';
import {
  ColorRef,
  Point,
  ShapeInspectorData,
  ShapeResizeOptions,
  Transform,
} from '@tfx-diagram/electron-renderer-web/shared-types';
import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';
import { Connection } from '../../../../connections/connection';
import { lineSelectFrame } from '../../../../control-frames/line-select-frame';
import { Endpoint } from '../../../../endpoints';
import { linkShapeArray } from '../../../../misc-functions';
import {
  AllShapeProps,
  LineConfig,
  LineProps,
  ShapeProps,
  SharedProperties,
} from '../../../../props';
import { LineControlPointReshaper, NopReshaper } from '../../../../reshapers';
import { ConnectorEndTypes } from '../../../../types';
import { Shape } from '../../../shape';
import { Group } from '../../../structural-shapes/group/group';
import { ConnectionPoint } from '../../control-shapes/connection-point/connection-point';
import { Handle } from '../../control-shapes/handle/handle';
import { Connector } from '../connector';

export const lineDefaults: Omit<LineProps, keyof ShapeProps> = {
  controlPoints: [
    { x: 10, y: 10 },
    { x: 20, y: 10 },
  ],
  lineDash: [],
  lineWidth: 0.5,
  strokeStyle: { colorSet: 'theme', ref: 'text1-3' },
  startEndpoint: null,
  finishEndpoint: null,
};

type DrawingParams = Pick<LineProps, 'controlPoints' | 'lineWidth'>;

export class Line extends Connector implements LineProps {
  controlPoints: Point[];
  lineDash: number[];
  lineWidth: number;
  strokeStyle: ColorRef;
  startEndpoint: Endpoint | null;
  finishEndpoint: Endpoint | null;

  constructor(config: LineConfig) {
    super({ ...config, shapeType: 'line', cursor: 'move' });
    this.controlPoints = this.validateControlPoints(config);
    this.lineDash = config.lineDash ?? lineDefaults.lineDash;
    this.lineWidth = config.lineWidth ?? lineDefaults.lineWidth;
    this.strokeStyle = config.strokeStyle ?? lineDefaults.strokeStyle;
    this.startEndpoint =
      config.startEndpoint === undefined
        ? lineDefaults.startEndpoint
        : config.startEndpoint;
    this.finishEndpoint =
      config.finishEndpoint === undefined
        ? lineDefaults.finishEndpoint
        : config.finishEndpoint;
  }

  reshape(end: ConnectorEndTypes, newPos: Point): Line {
    const reshaper = new LineControlPointReshaper();
    return reshaper.modifiedByConnection(this, end, newPos);
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

  copy(amendments: Partial<AllShapeProps>): Line {
    const a = amendments as Partial<SharedProperties<LineProps, AllShapeProps>>;
    const l = new Line({
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
    } as LineProps);
    return l;
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
    const strokeColor = ColorMapRef.resolve(this.strokeStyle);
    this.drawLine(c, params, lineWidth, strokeColor, t);
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
    this.drawLine(s, params, lineWidth, strokeStyle, t, true);
    s.restore();
  }

  getProps(): LineProps {
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
      startEndpoint: this.startEndpoint,
      finishEndpoint: this.finishEndpoint,
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
    return this.endPointHandles(connections);
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
    return this.endPointHandles(undefined, true);
  }

  resizeToBox(r: Rect, resizeOption: ShapeResizeOptions): Line {
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
    return lineSelectFrame(this.controlPoints, this.id);
  }

  text(): string {
    return '';
  }

  private drawLine(
    c: CanvasRenderingContext2D,
    params: DrawingParams,
    lineWidthPx: number,
    strokeStyle: string,
    t: Transform,
    shadow = false
  ) {
    const { controlPoints: cp } = params;
    if (cp.length < 2) {
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
      return pointTransform(p, t);
    });
    return {
      controlPoints: cp,
      lineWidth: t.scaleFactor * this.lineWidth,
    };
  }

  // TODO - this is same as implementation in curve - could
  // refactor into helper function that both class could
  // use
  private endPointHandles(
    connections: Map<string, Connection> | undefined,
    solid = false
  ): Shape[] {
    const lastPointIdx = this.controlPoints.length - 1;
    let startConnectionPoint: ConnectionPoint | undefined = undefined;
    let finishConnectionPoint: ConnectionPoint | undefined = undefined;
    connections?.forEach((connection) => {
      if (connection.connectorId === this.id) {
        if (connection.end === 'connectorStart') {
          //
          startConnectionPoint = new ConnectionPoint({
            id: Shape.generateId(),
            x: connection.connectionPoint.x,
            y: connection.connectionPoint.y,
          });
        } else if (connection.end === 'connectorFinish') {
          finishConnectionPoint = new ConnectionPoint({
            id: Shape.generateId(),
            x: connection.connectionPoint.x,
            y: connection.connectionPoint.y,
          });
        }
      }
    });
    const frame: Shape[] = [
      startConnectionPoint
        ? startConnectionPoint
        : new Handle({
            id: Shape.generateId(),
            x: this.controlPoints[0].x,
            y: this.controlPoints[0].y,
            pxWidth: 9,
            handleStyle: 'square',
            associatedShapeId: this.id,
            solid,
            reshaper: new NopReshaper(),
          }),
      finishConnectionPoint
        ? finishConnectionPoint
        : new Handle({
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
    return linkShapeArray(frame);
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
