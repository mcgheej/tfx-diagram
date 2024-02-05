export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RectEdges {
  left: number;
  top: number;
  right: number;
  bottom: number;
}
export type RectSides = 'top' | 'right' | 'bottom' | 'left';
