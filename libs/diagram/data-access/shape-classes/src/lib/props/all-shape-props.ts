import { ArcProps } from './arc-props';
import { CircleProps } from './circle-props';
import { ConnectionPointProps } from './connection-point-props';
import { CurveProps } from './curve-props';
import { GroupProps } from './group-props';
import { HandleProps } from './handle-props';
import { LineProps } from './line-props';
import { RectangleProps } from './rectangle-props';
import { TriangleProps } from './triangle-props';

export type AllShapeProps = LineProps &
  CurveProps &
  CircleProps &
  RectangleProps &
  TriangleProps &
  ArcProps &
  HandleProps &
  ConnectionPointProps &
  GroupProps;

type OmitNever<T extends Record<string, unknown>> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K];
};

export type SharedProperties<A, B> = OmitNever<Pick<A & B, keyof A & keyof B>>;
