import {
  Alignment,
  MousePositionCoordsType,
} from '@tfx-diagram/electron-renderer-web/shared-types';

export const settingsFeatureKey = 'settings';

export interface SettingsState {
  gridShow: boolean;
  gridSnap: boolean;
  gridSize: number;
  shapeSnap: boolean;
  showRulers: boolean;
  screenPixelDensity: number;
  pageAlignmentInViewport: Alignment;
  showMousePosition: boolean;
  mousePositionCoordsType: MousePositionCoordsType;
  showShapeInspector: boolean;
  jpegQuality: number;
}
