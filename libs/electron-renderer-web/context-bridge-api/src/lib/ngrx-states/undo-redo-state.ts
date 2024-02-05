import { SketchbookFileData } from '../electron-renderer-web-shared-types';

export interface UndoRedoHistory {
  past: Omit<SketchbookFileData, 'version'>[];
  present: Omit<SketchbookFileData, 'version'>;
  future: Omit<SketchbookFileData, 'version'>[];
}
