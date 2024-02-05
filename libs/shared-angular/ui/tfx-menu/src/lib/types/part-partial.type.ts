/**
 * Usage: type Derived = PartPartial<SourceType, 'prop1' | 'prop2'>
 * This will derive a type from SourceType where all properties other
 * than 'prop1' and 'prop2' optional.
 */
export type PartPartial<T, K extends keyof T> = {
  [X in Exclude<keyof T, K>]?: T[X];
} &
  {
    [P in K]-?: T[P];
  };
