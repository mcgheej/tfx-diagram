import { Point, Transform } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';
import { EMPTY_RECT } from './rect-functions';

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
