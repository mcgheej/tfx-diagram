import { randomNumber } from '@tfx-diagram/diagram/util/misc-functions';
import {
  ColorRef,
  Point,
  ShapeInspectorData,
  ShapeResizeOptions,
  Transform,
} from '@tfx-diagram/electron-renderer-web/shared-types';
import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';
import { Connection } from './connections/connection';
import {
  AllShapeProps,
  ShapeConfig,
  ShapeCursors,
  ShapeProps,
  ShapeTypes,
} from './props';

/**
 * Default values used for ShapeProps properties if the properties
 * are not present in the config parameter passed to the Shape
 * constructor.
 */
const shapeDefaults: Omit<ShapeProps, 'id' | 'shapeType' | 'cursor'> = {
  prevShapeId: '',
  nextShapeId: '',
  groupId: '',
  selectable: true,
  visible: true,
};

/**
 * Shape - base class for all shapes
 */
export abstract class Shape implements ShapeProps {
  /**
   * The 'shapesMap' and 'controlShapesMap' static properties
   * are used to generate unique shape ids. The maps are kept
   * synced with the application Store TODO - add reference to where
   * this happens once code produced
   */
  // static shapesMap: Map<string, Shape> = new Map<string, Shape>();
  // static controlShapesMap: Map<string, Shape> = new Map<string, Shape>();

  static shapeIdsMap: Map<string, string> = new Map<string, string>();

  static loadIdsMap(shapeConfigs: ShapeProps[]) {
    Shape.shapeIdsMap = new Map<string, string>();
    for (const shape of shapeConfigs) {
      Shape.shapeIdsMap.set(shape.id, shape.id);
    }
  }

  static resetIdsMap() {
    Shape.shapeIdsMap = new Map<string, string>();
  }
  /**
   *
   * @returns positive number represented as a string is not currently
   *          used as an id for any shape in the 'shapesMap' or the
   *          'controlShapesMap' properties.
   *
   * The unique id is generated using three random numbers, each in the
   * range 30 to 250. These are then combined to give a number that
   * can be used to represent an RGB colour. This is used in the Shadow
   * Canvas when a shape draws its shadow to aid with identifying the
   * shape under the current mouse position.
   */
  static generateId(): string {
    if (Shape.shapeIdsMap) {
      let id = '';
      let count = 0;
      do {
        const red = randomNumber(30, 250);
        const blue = randomNumber(30, 250);
        const green = randomNumber(30, 250);
        id = Math.round(red + blue * 256 + green * 65536).toString();
        if (Shape.shapeIdsMap.get(id)) {
          id = '';
        }
        if (count > 10000) {
          console.log(`Caution id generation taking long time`);
        }
        count++;
      } while (id === '');
      Shape.shapeIdsMap.set(id, id);
      return id;
    }
    return '';
  }

  /**
   * Properties required by the ShapeProps interface
   */
  id: string;
  prevShapeId: string;
  nextShapeId: string;
  groupId: string;
  shapeType: ShapeTypes;
  cursor: ShapeCursors;
  selectable: boolean;
  visible: boolean;

  /**
   *
   * @param config - contains initial values for the Shape instance
   *
   * If the config parameter doesn't contain an optional property
   * then the initial value is taken from the shapeDefaults constant
   */
  constructor(config: ShapeConfig) {
    (this.id = config.id),
      (this.shapeType = config.shapeType),
      (this.cursor = config.cursor);
    this.prevShapeId = config.prevShapeId ?? shapeDefaults.prevShapeId;
    this.nextShapeId = config.nextShapeId ?? shapeDefaults.nextShapeId;
    this.groupId = config.groupId ?? shapeDefaults.groupId;
    this.selectable = config.selectable ?? shapeDefaults.selectable;
    this.visible = config.visible ?? shapeDefaults.visible;
  }

  abstract anchor(shapes?: Map<string, Shape>): Point;
  abstract attachBoundary(
    p: Point,
    t: Transform,
    connectionHook: Connection
  ): Connection | undefined;
  abstract boundingBox(): Rect;
  abstract colors(): { lineColor: ColorRef; fillColor: ColorRef };
  abstract copy(amendments: Partial<AllShapeProps>): Shape;
  abstract dragOffset(mousePagePos: Point, shapes?: Map<string, Shape>): Point;
  abstract draw(c: CanvasRenderingContext2D, t: Transform): void;
  abstract drawShadow(s: CanvasRenderingContext2D, t: Transform): void;
  abstract getProps(): ShapeProps;
  abstract highLightFrame(shapes?: Map<string, Shape>): Shape[]; // sketch: getHighlightShapes
  abstract inspectorViewData(): ShapeInspectorData[];
  abstract move(shiftDelta: Point): Shape;
  abstract outlineShapes(shapes?: Map<string, Shape>): Shape[]; // sketch: getOutlineShapes
  abstract resizeToBox(r: Rect, resizeOption: ShapeResizeOptions): Shape;
  abstract selectFrame(shapes?: Map<string, Shape>): Shape[]; // sketch: getSingleSelectionShapes
  abstract text(): string;

  category(): string {
    return 'shape';
  }
}
