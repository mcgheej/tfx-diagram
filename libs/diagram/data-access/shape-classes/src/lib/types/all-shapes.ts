import { GroupProps } from '../control-shapes/group';
import { HandleProps } from '../control-shapes/handle';
import { ArcProps } from '../standard-shapes/arc/arc';
import { CircleProps } from '../standard-shapes/circle/circle';
import { CurveProps } from '../standard-shapes/curve/curve';
import { LineProps } from '../standard-shapes/line/line';
import { RectangleProps } from '../standard-shapes/rectangle/rectangle';
import { TriangleProps } from '../standard-shapes/triangle/triangle';

export type AllTypes = LineProps &
  CurveProps &
  CircleProps &
  RectangleProps &
  TriangleProps &
  ArcProps &
  HandleProps &
  GroupProps;

type OmitNever<T extends Record<string, unknown>> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K];
};

export type SharedProperties<A, B> = OmitNever<Pick<A & B, keyof A & keyof B>>;
