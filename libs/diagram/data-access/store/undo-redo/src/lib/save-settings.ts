import { LocalStorage } from '@tfx-diagram/diagram/util/misc-functions';
import { AppState } from '@tfx-diagram/electron-renderer-web-context-bridge-api';
import {
  LS_GRID_SHOW,
  LS_GRID_SNAP,
  LS_JPEG_QUALITY,
  LS_MOUSE_POSITION_COORDS_TYPE,
  LS_PAGE_ALIGNMENT_IN_VIEWPORT,
  LS_SCREEN_PIXEL_DENSITY,
  LS_SHAPE_SNAP,
  LS_SHOW_MOUSE_POSITION,
  LS_SHOW_RULERS,
  LS_SHOW_SHAPE_INSPECTOR,
} from '@tfx-diagram/electron-renderer-web/shared-types';

/**
 * Function to save settings values to local storage - used
 * after undo and redo operations as state values updated
 * without firing actions that update local storage via effects
 */
export function saveSettings(state: AppState) {
  const s = state.settings;
  LocalStorage.setItem(LS_GRID_SHOW, s.gridShow);
  LocalStorage.setItem(LS_GRID_SNAP, s.gridSnap);
  LocalStorage.setItem(LS_SHAPE_SNAP, s.shapeSnap);
  LocalStorage.setItem(LS_SHOW_RULERS, s.showRulers);
  LocalStorage.setItem(LS_SCREEN_PIXEL_DENSITY, s.screenPixelDensity);
  LocalStorage.setItem(LS_PAGE_ALIGNMENT_IN_VIEWPORT, s.pageAlignmentInViewport);
  LocalStorage.setItem(LS_SHOW_MOUSE_POSITION, s.showMousePosition);
  LocalStorage.setItem(LS_MOUSE_POSITION_COORDS_TYPE, s.mousePositionCoordsType);
  LocalStorage.setItem(LS_SHOW_SHAPE_INSPECTOR, s.showShapeInspector);
  LocalStorage.setItem(LS_JPEG_QUALITY, s.jpegQuality);
}
