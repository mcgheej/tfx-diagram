import { Point, PolarPoint, Transform } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';
import { EMPTY_RECT } from './rect-functions';

export function pointFromPolarPoint({ r, a }: PolarPoint): Point {
  return {
    x: r * Math.cos((a * Math.PI) / 180),
    y: r * Math.sin((a * Math.PI) / 180),
  };
}

/**
 *
 * @param param0 - cartesian coords point
 * @returns - polar coords point
 *
 * The Math.atan2 function returns an angle between 180 <= a > -180
 * where 180 degrees is at 12 o'clock and decreases clockwise. We
 * want the polar angle a to range clockwise from 0 <= a < 360 and
 * increases clockwise.
 */
export function polarPointFromPoint({ x, y }: Point): PolarPoint {
  return {
    r: Math.sqrt(x ** 2 + y ** 2),
    a: (810 - (Math.atan2(x, y) * 180) / Math.PI) % 360,
  };
}

export function pointAdd(a: Point, b: Point): Point {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  };
}

export function pointSubtract(a: Point, b: Point): Point {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  };
}

export const pointTransform = (p: Point, t: Transform): Point => {
  return {
    x: t.scaleFactor * (p.x + t.transX),
    y: t.scaleFactor * (p.y + t.transY),
  };
};

export const pointRotate = (p: Point, angle: number): Point => {
  return {
    x: p.x * Math.cos(angle) - p.y * Math.sin(angle),
    y: p.y * Math.cos(angle) + p.x * Math.sin(angle),
  };
};

export const pointScale = (p: Point, s: number): Point => {
  return { x: p.x * s, y: p.y * s };
};

export const pointInRect = (p: Point, r: Rect): boolean => {
  if (p.x < r.x || p.y < r.y || p.x > r.x + r.width || p.y > r.y + r.height) {
    return false;
  }
  return true;
};

export function pointsCopy(p: Point[]): Point[] {
  return p.map((p) => ({ ...p }));
}

export function pointConsole(p: Point, msg: string) {
  if (msg) {
    console.log(`${msg} - x: ${p.x}, y: ${p.y}`);
  } else {
    console.log(`x: ${p.x}, y: ${p.y}`);
  }
}

export function pointsBoundingBox(points: Point[]): Rect {
  if (points.length < 1) {
    return EMPTY_RECT;
  }
  let minx = points[0].x;
  let maxx = minx;
  let miny = points[0].y;
  let maxy = miny;
  points.map((p) => {
    if (p.x < minx) {
      minx = p.x;
    }
    if (p.x > maxx) {
      maxx = p.x;
    }
    if (p.y < miny) {
      miny = p.y;
    }
    if (p.y > maxy) {
      maxy = p.y;
    }
  });
  return {
    x: minx,
    y: miny,
    width: maxx - minx,
    height: maxy - miny,
  };
}

/**
 * Calculate the distance between two points
 */
export function pointsDistance(p1: Point, p2: Point): number {
  if (p1.x === p2.x) {
    return Math.abs(p1.y - p2.y);
  }
  if (p1.y === p2.y) {
    return Math.abs(p1.x - p2.x);
  }
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}
