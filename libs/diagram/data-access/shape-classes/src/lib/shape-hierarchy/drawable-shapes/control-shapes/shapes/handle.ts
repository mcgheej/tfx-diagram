import { ColorMapRef } from '@tfx-diagram/diagram/data-access/color-classes';
import {
  ColorRef,
  Point,
  Transform,
} from '@tfx-diagram/electron-renderer-web/shared-types';
import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';
import {
  AllShapeProps,
  HandleConfig,
  HandleProps,
  HandleStyle,
  HandleTypes,
  ShapeProps,
  SharedProperties,
} from '../../../../props';
import { Reshaper } from '../../../../reshaper/reshaper';
import { DEFAULT_OUTLINE_COLOUR } from '../../../../types';
import { Shape } from '../../../shape';
import { ControlShape } from '../control-shape';

const handleDefaults: Omit<HandleProps, keyof ShapeProps | 'x' | 'y' | 'reshaper'> = {
  pxWidth: 11,
  fillStyle: DEFAULT_OUTLINE_COLOUR,
  solid: false,
  handleStyle: 'round',
  highlightOn: false,
  associatedShapeId: '',
  handleType: 'notConnectorEnd',
};

type DrawingParams = Pick<HandleProps, 'x' | 'y'>;

export class Handle extends ControlShape implements HandleProps {
  x: number;
  y: number;
  pxWidth: number;
  fillStyle: ColorRef;
  solid: boolean;
  handleStyle: HandleStyle;
  highlightOn: boolean;
  associatedShapeId: string;
  reshaper: Reshaper;
  handleType: HandleTypes;

  constructor(config: HandleConfig) {
    super({
      ...config,
      shapeType: 'handle',
      cursor: config.cursor ?? 'move',
      selectable: config.selectable ?? false,
    });
    this.x = config.x;
    this.y = config.y;
    this.pxWidth = config.pxWidth ?? handleDefaults.pxWidth;
    this.fillStyle = config.fillStyle ?? handleDefaults.fillStyle;
    this.solid = config.solid ?? handleDefaults.solid;
    this.handleStyle = config.handleStyle ?? handleDefaults.handleStyle;
    this.highlightOn = config.highlightOn ?? handleDefaults.highlightOn;
    this.associatedShapeId = config.associatedShapeId ?? handleDefaults.associatedShapeId;
    this.reshaper = config.reshaper;
    this.handleType = config.handleType ?? handleDefaults.handleType;
  }

  anchor(): Point {
    return {
      x: this.x,
      y: this.y,
    };
  }

  boundingBox(): Rect {
    return {
      x: this.x - this.pxWidth / 2,
      y: this.y - this.pxWidth / 2,
      width: this.pxWidth,
      height: this.pxWidth,
    };
  }

  colors(): { lineColor: ColorRef; fillColor: ColorRef } {
    return {
      lineColor: { colorSet: 'empty', ref: '' },
      fillColor: { colorSet: 'empty', ref: '' },
    };
  }

  copy(amendments: Partial<AllShapeProps>): Handle {
    const a = amendments as Partial<SharedProperties<HandleProps, AllShapeProps>>;
    const h = new Handle({
      id: this.id,
      prevShapeId: a.prevShapeId ?? this.prevShapeId,
      nextShapeId: a.nextShapeId ?? this.nextShapeId,
      cursor: a.cursor ?? this.cursor,
      x: a.x ?? this.x,
      y: a.y ?? this.y,
      pxWidth: a.pxWidth ?? this.pxWidth,
      fillStyle: a.fillStyle ?? this.fillStyle,
      solid: a.solid ?? this.solid,
      handleStyle: a.handleStyle ?? this.handleStyle,
      highlightOn: a.highlightOn ?? this.highlightOn,
      associatedShapeId: a.associatedShapeId ?? this.associatedShapeId,
      selectable: a.selectable ?? this.selectable,
      visible: a.visible ?? this.visible,
      reshaper: a.reshaper ?? this.reshaper,
      handleType: a.handleType ?? this.handleType,
    });
    return h;
  }

  dragOffset(mousePagePos: Point): Point {
    return {
      x: mousePagePos.x - this.x,
      y: mousePagePos.y - this.y,
    };
  }

  draw(c: CanvasRenderingContext2D, t: Transform): void {
    if (!this.visible) {
      return;
    }
    c.save();
    if (this.handleStyle === 'square') {
      this.drawSquareHandle(c, this.getParams(t));
    } else {
      this.drawRoundhandle(c, this.getParams(t));
    }
    c.restore();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  override drawShadow(s: CanvasRenderingContext2D, t: Transform): void {
    if (!this.visible) {
      return;
    }
    const { x, y } = this.getParams(t);
    const d = Math.floor(this.pxWidth / 2);
    const size = 2 * d + 5;
    s.save();
    s.fillStyle = '#' + (+this.id).toString(16);
    s.fillRect(x - d, y - d, size, size);
    s.restore();
  }

  getProps(): HandleProps {
    return {
      id: this.id,
      prevShapeId: this.prevShapeId,
      nextShapeId: this.nextShapeId,
      groupId: this.groupId,
      shapeType: this.shapeType,
      cursor: this.cursor,
      x: this.x,
      y: this.y,
      pxWidth: this.pxWidth,
      fillStyle: this.fillStyle,
      solid: this.solid,
      visible: this.visible,
      handleStyle: this.handleStyle,
      highlightOn: this.highlightOn,
      associatedShapeId: this.associatedShapeId,
      selectable: this.selectable,
      reshaper: this.reshaper,
      handleType: this.handleType,
    };
  }

  move(shiftDelta: Point): Shape {
    return this.copy({
      x: this.x + shiftDelta.x,
      y: this.y + shiftDelta.y,
    });
  }

  private drawSquareHandle(c: CanvasRenderingContext2D, { x, y }: DrawingParams) {
    const d = Math.floor(this.pxWidth / 2);
    c.fillStyle = ColorMapRef.resolve(this.fillStyle);
    c.lineWidth = 1;
    c.fillRect(x - d, y - d, 2 * d + 1, 2 * d + 1);
    if (!this.solid && !this.highlightOn) {
      c.fillStyle = 'white';
      c.fillRect(x - d + 1, y - d + 1, 2 * d - 1, 2 * d - 1);
    }
  }

  private drawRoundhandle(c: CanvasRenderingContext2D, { x, y }: DrawingParams) {
    const d = Math.floor(this.pxWidth / 2);
    c.fillStyle = ColorMapRef.resolve(this.fillStyle);
    c.lineWidth = 1;
    c.beginPath();
    c.arc(x, y, d + 1, 0, 2 * Math.PI);
    c.fill();
    if (!this.solid && !this.highlightOn) {
      c.fillStyle = 'white';
      c.beginPath();
      c.arc(x, y, d, 0, 2 * Math.PI);
      c.fill();
    }
  }

  private getParams(t: Transform): DrawingParams {
    return {
      x: t.scaleFactor * (this.x + t.transX),
      y: t.scaleFactor * (this.y + t.transY),
    };
  }
}
