import { GridProps, Point } from '@tfx-diagram/electron-renderer-web/shared-types';

export function gridSnapPoint(
  p: Point,
  { gridSnap: gSnap, gridSize: gSize }: GridProps
): Point {
  if (gSnap) {
    return { x: gridSnapCoord(p.x, gSize), y: gridSnapCoord(p.y, gSize) };
  }
  return p;
}

function gridSnapCoord(p: number, gSize: number): number {
  const d = p % gSize;
  const g1 = p - d;
  if (p < g1 + gSize / 2) {
    return g1;
  }
  return g1 + gSize;
}
