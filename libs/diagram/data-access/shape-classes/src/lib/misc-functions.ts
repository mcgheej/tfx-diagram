import { GridProps, Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Group } from './control-shapes/group';
import { Shape } from './shape';

export const calcBezierPoint = (i: number, cp: Point[], t: number): Point => {
  return {
    x: calcBezierValue(cp[i - 1].x, cp[i].x, cp[i + 1].x, cp[i + 2].x, t),
    y: calcBezierValue(cp[i - 1].y, cp[i].y, cp[i + 1].y, cp[i + 2].y, t),
  };
};

export const calcBezierValue = (
  p0: number,
  p1: number,
  p2: number,
  p3: number,
  t: number
): number => {
  return (
    (1 - t) ** 3 * p0 + 3 * (1 - t) ** 2 * t * p1 + 3 * (1 - t) * t ** 2 * p2 + t ** 3 * p3
  );
};

/**
 *
 * @param p1 - first line endpoint
 * @param p2 - second line endpoint
 * @param t - interpolation point parameter
 * @returns - interpolated / extrapolated point
 *
 * The t parameter specifies the position of the interpolated (0 <= t <= 1)
 * or extrapolated (t > 1).
 */
export const lineInterpolate = (p1: Point, p2: Point, t: number): Point => {
  t = Math.abs(t);
  return {
    x: p1.x + (p2.x - p1.x) * t,
    y: p1.y + (p2.y - p1.y) * t,
  };
};

/**
 *
 * @param p1 - point that has moved
 * @param p2 - origin of rotation
 * @param p3 - point to realign
 */
export const realignPoint = (p1: Point, p2: Point, p3: Point): Point => {
  // Calculate the square of the distance from the origin of rotation
  // to the point to realign
  const a = p3.x - p2.x;
  const b = p3.y - p2.y;
  const dPower2 = a * a + b * b;

  // Calculate the absolute x and y offsets for the new position
  // of p3, relative to p2, that will realign it with p1 and p2
  let x = 0;
  let y = 0;
  if (p1.x === p2.x) {
    x = 0;
    y = Math.sqrt(dPower2);
  } else {
    const m = (p1.y - p2.y) / (p1.x - p2.x);
    x = Math.sqrt(dPower2 / (m * m + 1));
    y = Math.abs(m * x);
  }

  // Based on the position of p1 to p2 realign p3 using the absolute
  // offsets calculated
  if (p1.x < p2.x && p1.y < p2.y) {
    x = p2.x + x;
    y = p2.y + y;
  } else if (p1.x >= p2.x && p1.y < p2.y) {
    x = p2.x - x;
    y = p2.y + y;
  } else if (p1.x >= p2.x && p1.y >= p2.y) {
    x = p2.x - x;
    y = p2.y - y;
  } else {
    x = p2.x + x;
    y = p2.y - y;
  }

  return {
    x,
    y,
  };
};

export const gridSnapPoint = (
  p: Point,
  { gridSnap: gSnap, gridSize: gSize }: GridProps
): Point => {
  if (gSnap) {
    return { x: gridSnapCoord(p.x, gSize), y: gridSnapCoord(p.y, gSize) };
  }
  return p;
};

export const gridSnapCoord = (p: number, gSize: number): number => {
  const d = p % gSize;
  const g1 = p - d;
  if (p < g1 + gSize / 2) {
    return g1;
  }
  return g1 + gSize;
};

/**
 * Returns shapes in the selection (includes shapes within
 * groups)
 */
export const getDrawableShapesInSelection = (
  selectedShapeIds: string[],
  shapes: Map<string, Shape>
): Shape[] => {
  const result: Shape[] = [];
  selectedShapeIds.map((id) => {
    const s = shapes.get(id);
    if (s) {
      if (s.shapeType === 'group') {
        result.push(...Group.drawableShapes(s as Group, shapes));
      } else {
        result.push(s);
      }
    }
  });
  return result;
};

/**
 * Returns ids of all shapes in the selection (includes shapes within
 * groups)
 */
export const getDrawableShapeIdsInSelection = (
  selectedShapeIds: string[],
  shapes: Map<string, Shape>
): string[] => {
  const shapeIds: string[] = [];
  selectedShapeIds.map((id) => {
    const s = shapes.get(id);
    if (s) {
      if (s.shapeType === 'group') {
        shapeIds.push(...Group.drawableShapeIds(s as Group, shapes));
      } else {
        shapeIds.push(id);
      }
    }
  });
  return shapeIds;
};

export const getAllShapesInSelection = (
  selectedShapeIds: string[],
  shapes: Map<string, Shape>
): Shape[] => {
  const result: Shape[] = [];
  selectedShapeIds.map((id) => {
    const s = shapes.get(id);
    if (s) {
      result.push(s);
      if (s.shapeType === 'group') {
        result.push(...Group.shapes(s as Group, shapes));
      }
    }
  });
  return result;
};

export const getAllShapeIdsInSelection = (
  selectedShapeIds: string[],
  shapes: Map<string, Shape>
): string[] => {
  const shapeIds: string[] = [];
  selectedShapeIds.map((id) => {
    const s = shapes.get(id);
    if (s) {
      shapeIds.push(s.id);
      if (s.shapeType === 'group') {
        shapeIds.push(...Group.shapeIds(s as Group, shapes));
      }
    }
  });
  return shapeIds;
};
