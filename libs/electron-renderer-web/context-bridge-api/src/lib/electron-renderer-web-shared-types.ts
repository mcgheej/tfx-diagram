import { ConnectionProps, ShapeProps } from '@tfx-diagram/diagram-data-access-shape-base-class';
import { PagesState } from './ngrx-states/pages-state';
import { SketchbookState } from './ngrx-states/sketchbook-state';

export const currentVersion = {
  id: 'aF_W0S1IiTmXRRj0PZyCc',
  level: 1,
};
export interface SketchbookFileData {
  version: {
    id: string;
    level: number;
  };
  sketchbook: SketchbookState;
  pages: PagesState;
  shapeObjects: ShapeProps[];
  connectionObjects: ConnectionProps[];
}

export interface SaveFileResult {
  title: string;
  path: string;
}
