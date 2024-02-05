import { Point, Transform } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';

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
