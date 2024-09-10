import { ConnectionProps, ShapeProps } from '@tfx-diagram/diagram/data-access/shape-classes';
import { Color } from '@tfx-diagram/shared-angular/utils/shared-types';
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
  customColors: { [id: string]: Color };
  customColorIds: string[];
}

export interface SaveFileResult {
  title: string;
  path: string;
}
