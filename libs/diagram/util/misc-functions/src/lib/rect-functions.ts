import {
  LineSegment,
  Point,
  Size,
} from '@tfx-diagram/electron-renderer-web/shared-types';
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

export function rectInflate(r: Rect, s: number): Rect {
  if (r.width + 2 * s <= 0 || r.height + 2 * s <= 0) {
    return {
      x: r.x + r.width / 2,
      y: r.y + r.height / 2,
      width: 0,
      height: 0,
    };
  }

  return {
    x: r.x - s,
    y: r.y - s,
    width: r.width + 2 * s,
    height: r.height + 2 * s,
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

export function rectEdges(r: Rect): RectEdges {
  return {
    left: r.x,
    top: r.y,
    right: r.x + r.width,
    bottom: r.y + r.height,
  };
}

export const getRectSize = (r: Rect): Size => {
  return {
    width: r.width,
    height: r.height,
  };
};

/**
 *
 * @param r - source rectangle
 * @param a - angle to rotate clockwise (radians)
 * @param origin - point to rotate around
 * @returns
 */
export const rectRotate = (r: Rect, a: number, origin: Point): Rect => {
  if (a === 0) {
    return r;
  }
  const p1: Point = { x: r.x - origin.x, y: r.y - origin.y };
  const p2: Point = { x: r.x + r.width - origin.x, y: r.y + r.height - origin.y };
  return rectNormalised(
    {
      x: p1.x * Math.cos(a) - p1.y * Math.sin(a) + origin.x,
      y: p1.y * Math.cos(a) + p1.x * Math.sin(a) + origin.y,
    },
    {
      x: p2.x * Math.cos(a) - p2.y * Math.sin(a) + origin.x,
      y: p2.y * Math.cos(a) + p2.x * Math.sin(a) + origin.y,
    }
  );
};

export const rectFromSize = (size: Size): Rect => {
  return {
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
  };
};

export function rectTopLine(r: Rect): LineSegment {
  const { x, y, width } = r;
  return { a: { x, y }, b: { x: x + width, y } };
}

export function rectRightLine(r: Rect): LineSegment {
  const { x, y, width, height } = r;
  return { a: { x: x + width, y }, b: { x: x + width, y: y + height } };
}

export function rectBottomLine(r: Rect): LineSegment {
  const { x, y, width, height } = r;
  return { a: { x, y: y + height }, b: { x: x + width, y: y + height } };
}

export function rectLeftLine(r: Rect): LineSegment {
  const { x, y, height } = r;
  return { a: { x, y }, b: { x, y: y + height } };
}
