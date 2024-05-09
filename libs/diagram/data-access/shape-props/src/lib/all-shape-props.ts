import {
  ArcProps,
  CircleProps,
  CurveProps,
  GroupProps,
  HandleProps,
  LineProps,
  RectangleProps,
  TriangleProps,
} from '@tfx-diagram/diagram-data-access-shape-props';

export type AllShapeProps = LineProps &
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
