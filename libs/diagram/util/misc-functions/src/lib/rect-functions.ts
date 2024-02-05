import { Point, Size } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Rect, RectEdges } from '@tfx-diagram/shared-angular/utils/shared-types';

export const EMPTY_RECT: Rect = { x: 0, y: 0, width: 0, height: 0 };

export function rectSame(a: Rect, b: Rect): boolean {
  return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}

export function rectNormalised(p1: Point, p2: Point): Rect {
  return {
    x: p1.x <= p2.x ? p1.x : p2.x,
    y: p1.y <= p2.y ? p1.y : p2.y,
    width: Math.abs(p1.x - p2.x),
    height: Math.abs(p1.y - p2.y),
  };
}

export function rectIntersect(a: Rect, b: Rect): Rect | null {
  const aRight = a.x + a.width;
  const aBottom = a.y + a.height;
  const bRight = b.x + b.width;
  const bBottom = b.y + b.height;
  const x1 = Math.max(a.x, b.x);
  const y1 = Math.max(a.y, b.y);
  const x2 = Math.min(aRight, bRight);
  const y2 = Math.min(aBottom, bBottom);
  if (x1 > x2 || y1 > y2) {
    return null;
  }
  return {
    x: x1,
    y: y1,
    width: x2 - x1,
    height: y2 - y1,
  } as Rect;
}

export function rectInflate(a: Rect, s: number): Rect {
  return {
    x: a.x - s,
    y: a.y - s,
    width: a.width + 2 * s,
    height: a.height + 2 * s,
  } as Rect;
}

export function rectUnionArray(rectangles: Rect[]): Rect {
  if (rectangles.length === 0) {
    return EMPTY_RECT;
  }
  if (rectangles.length === 1) {
    return { ...rectangles[0] };
  }
  let rect = {
    x: rectangles[0].x,
    y: rectangles[0].y,
    width: rectangles[0].width,
    height: rectangles[0].height,
  };
  for (let i = 1; i < rectangles.length; i++) {
    rect = rectUnion(rect, rectangles[i]);
  }
  return rect;
}

export function rectUnion(a: Rect, b: Rect): Rect {
  const { right: aRight, bottom: aBottom } = rectEdges(a);
  const { right: bRight, bottom: bBottom } = rectEdges(b);
  const left = a.x < b.x ? a.x : b.x;
  const top = a.y < b.y ? a.y : b.y;
  const right = aRight > bRight ? aRight : bRight;
  const bottom = aBottom > bBottom ? aBottom : bBottom;
  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
  };
}

export function rectEdges(a: Rect): RectEdges {
  return {
    left: a.x,
    top: a.y,
    right: a.x + a.width,
    bottom: a.y + a.height,
  };
}

export const getRectSize = (r: Rect): Size => {
  return {
    width: r.width,
    height: r.height,
  };
};
