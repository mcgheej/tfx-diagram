import { pageFormats } from './page-formats';

/**
 * Horizontal alignment defines how a object is aligned horizontally.
 *
 *    - left:   align left side of object with left side of container
 *    - centre: align the object so that it is centred horizontally in
 *              the container
 *    - right:  align the right side of the object with the right side
 *              of the container
 */
export type HorizontalAlignment = 'left' | 'center' | 'right';

/**
 * Vertical alignment defines how a page is aligned vertically
 * in the viewport when the view window is higher than the page.
 *
 *    - top:    align top side of page with top side of viewport
 *    - centre: align the page so that it is centred vertically in
 *              the viewport
 *    - bottom: align the bottom side of the page with the bottom
 *              side of the viewport
 */
export type VerticalAlignment = 'top' | 'center' | 'bottom';

/**
 * This type is used to specify the horizontal and vertical
 * alignment of an object in its container, e.g. a page in
 * the viewport
 */
export interface Alignment {
  horizontal: HorizontalAlignment;
  vertical: VerticalAlignment;
}

export type ObjectAlignment = 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom';

export type ObjectDistribution = 'horizontally' | 'vertically';

export interface Padding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export type MousePositionCoordsType = 'page' | 'viewport';

export interface Point {
  x: number;
  y: number;
}

/**
 * Defines a 2D point using polar coordinates.
 *
 * r - distance from origin to point
 * a - angle of line connecting origin to point in
 *     degrees, clockwise from 3 o'clock
 */
export interface PolarPoint {
  r: number;
  a: number;
}

export interface LineSegment {
  a: Point;
  b: Point;
}

export interface Size {
  width: number;
  height: number;
}

export type SketchbookStatus =
  | 'closed'
  | 'closing'
  | 'saved'
  | 'saving'
  | 'modified'
  | 'loading'
  | 'creating';

export type PageFormats = typeof pageFormats[number];
export type PageLayout = 'Portrait' | 'Landscape';

export interface Page {
  id: string;
  title: string;
  size: Size;
  format: PageFormats;
  layout: PageLayout;
  zoomFactor: number;
  windowCentre: Point | null;
  firstShapeId: string;
  lastShapeId: string;
}

export interface Transform {
  scaleFactor: number;
  transX: number;
  transY: number;
}

export interface Range {
  min: number;
  max: number;
}

export interface GridProps {
  gridShow: boolean;
  gridSnap: boolean;
  gridSize: number;
}

export interface ShapeInspectorData {
  propName: string;
  value: string;
}
