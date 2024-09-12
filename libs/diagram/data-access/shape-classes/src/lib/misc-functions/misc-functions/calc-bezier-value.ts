export function calcBezierValue(
  p0: number,
  p1: number,
  p2: number,
  p3: number,
  t: number
): number {
  return (
    (1 - t) ** 3 * p0 +
    3 * (1 - t) ** 2 * t * p1 +
    3 * (1 - t) * t ** 2 * p2 +
    t ** 3 * p3
  );
}
