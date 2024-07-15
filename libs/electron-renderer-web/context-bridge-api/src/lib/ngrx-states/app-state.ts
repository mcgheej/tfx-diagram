import { ColorsState } from '@tfx-diagram/electron-renderer-web/ngrx-state-colors';
import { ControlFrameState } from './control-frame-state';
import { PagesState } from './pages-state';
import { SettingsState } from './settings-state';
import { ShapesState } from './shapes-state';
import { SketchbookState } from './sketchbook-state';
import { TransformState } from './transform-state';
import { UndoRedoState } from './undo-redo-state';

export interface AppState {
  colors: ColorsState;
  controlFrame: ControlFrameState;
  pages: PagesState;
  settings: SettingsState;
  shapes: ShapesState;
  sketchbook: SketchbookState;
  transform: TransformState;
  undoRedo: UndoRedoState;
}
