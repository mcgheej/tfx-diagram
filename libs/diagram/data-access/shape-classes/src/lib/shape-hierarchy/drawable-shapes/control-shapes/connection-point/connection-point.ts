import {
  ColorRef,
  Point,
  Transform,
} from '@tfx-diagram/electron-renderer-web/shared-types';
import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';
import { AllShapeProps, SharedProperties } from '../../../../props';
import {
  ConnectionPointConfig,
  ConnectionPointProps,
} from '../../../../props/connection-point-props';
import { Shape } from '../../../shape';
import { ControlShape } from '../control-shape';

type DrawingParams = Pick<ConnectionPointProps, 'x' | 'y'>;

const HALF_CROSS_SIZE = 3;

export class ConnectionPoint extends ControlShape implements ConnectionPointProps {
  x: number;
  y: number;

  constructor(config: ConnectionPointConfig) {
    super({
      ...config,
      shapeType: 'connectionPoint',
      cursor: config.cursor ?? 'default',
      selectable: false,
    });
    this.x = config.x;
    this.y = config.y;
  }

  anchor(): Point {
    return {
      x: this.x,
      y: this.y,
    };
  }

  boundingBox(): Rect {
    return {
      x: this.x - HALF_CROSS_SIZE / 2,
      y: this.y - HALF_CROSS_SIZE / 2,
      width: HALF_CROSS_SIZE * 2 + 1,
      height: HALF_CROSS_SIZE * 2 + 1,
    };
  }

  colors(): { lineColor: ColorRef; fillColor: ColorRef } {
    return {
      lineColor: { colorSet: 'empty', ref: '' },
      fillColor: { colorSet: 'empty', ref: '' },
    };
  }

  copy(amendments: Partial<AllShapeProps>): ConnectionPoint {
    const a = amendments as Partial<
      SharedProperties<ConnectionPointProps, AllShapeProps>
    >;
    const c = new ConnectionPoint({
      id: this.id,
      prevShapeId: a.prevShapeId ?? this.prevShapeId,
      nextShapeId: a.nextShapeId ?? this.nextShapeId,
      cursor: a.cursor ?? this.cursor,
      x: a.x ?? this.x,
      y: a.y ?? this.y,
      selectable: a.selectable ?? this.selectable,
      visible: a.visible ?? this.visible,
    });
    return c;
  }

  dragOffset(): Point {
    return { x: 0, y: 0 };
  }

  draw(c: CanvasRenderingContext2D, t: Transform): void {
    if (!this.visible) {
      return;
    }
    const { x, y } = this.getParams(t);
    c.save();
    c.lineWidth = 2;
    c.strokeStyle = 'red';
    c.beginPath();
    c.moveTo(x - HALF_CROSS_SIZE, y - HALF_CROSS_SIZE);
    c.lineTo(x + HALF_CROSS_SIZE, y + HALF_CROSS_SIZE);
    c.moveTo(x + HALF_CROSS_SIZE, y - HALF_CROSS_SIZE);
    c.lineTo(x - HALF_CROSS_SIZE, y + HALF_CROSS_SIZE);
    c.stroke();
    c.restore();
  }

  getProps(): ConnectionPointProps {
    return {
      id: this.id,
      prevShapeId: this.prevShapeId,
      nextShapeId: this.nextShapeId,
      groupId: this.groupId,
      shapeType: this.shapeType,
      cursor: this.cursor,
      x: this.x,
      y: this.y,
      visible: this.visible,
      selectable: this.selectable,
    };
  }

  move(shiftDelta: Point): Shape {
    return this.copy({
      x: this.x + shiftDelta.x,
      y: this.y + shiftDelta.y,
    });
  }

  private getParams(t: Transform): DrawingParams {
    return {
      x: t.scaleFactor * (this.x + t.transX),
      y: t.scaleFactor * (this.y + t.transY),
    };
  }
}
