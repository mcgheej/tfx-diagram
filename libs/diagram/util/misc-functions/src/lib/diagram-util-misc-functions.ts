import { Page, Point, Transform } from '@tfx-diagram/electron-renderer-web/shared-types';

export const PRECISION = 1e-10;

export const equals = (a: number, b: number): boolean => {
  return Math.abs(a - b) < PRECISION;
};

export const lessThan = (a: number, b: number): boolean => {
  return b - a > PRECISION;
};

export const greaterThan = (a: number, b: number): boolean => {
  return a - b > PRECISION;
};

export function inverseTransform(p: Point, t: Transform): Point {
  return {
    x: (p.x - t.transX * t.scaleFactor) / t.scaleFactor,
    y: (p.y - t.transY * t.scaleFactor) / t.scaleFactor,
  };
}

export const pageNameInUse = (
  newName: string,
  pages: { [id: string]: Page },
  pageIds: string[]
): boolean => {
  let inUse = false;
  for (const id of pageIds) {
    if (pages[id] && newName === pages[id].title) {
      inUse = true;
      break;
    }
  }
  return inUse;
};

export const randomNumber = (lowerLimit: number, upperLimit: number): number => {
  return Math.round((upperLimit - lowerLimit) * Math.random() + lowerLimit);
};

export const randomColour = (): string => {
  const colours = ['#000000', '#0000ff', '#00ff00', '#00ffff', '#ff0000', '#ff00ff', '#ffff00'];
  return colours[Math.round(Math.random() * 6)];
};

export const getHexRGB = (r: number, g: number, b: number): string => {
  return '#' + getHexByte(r) + getHexByte(g) + getHexByte(b);
};

export const getHexByte = (n: number): string => {
  if (n < 0 || n > 255) {
    return '';
  }
  const result = n.toString(16);
  if (result.length === 2) {
    return result;
  }
  if (result.length === 1) {
    return '0' + result;
  }
  return '00';
};

export const getSubMap = <T>(source: Map<string, T>, ids: string[]): Map<string, T> => {
  const subMap = new Map<string, T>();
  ids.map((id) => {
    const item = source.get(id);
    if (item) {
      subMap.set(id, item);
    }
  });
  return subMap;
};
