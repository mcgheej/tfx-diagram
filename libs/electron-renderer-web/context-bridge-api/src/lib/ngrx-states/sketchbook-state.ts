import { SketchbookStatus } from '@tfx-diagram/electron-renderer-web/shared-types';

export const sketchbookFeatureKey = 'sketchbook';

export interface SketchbookState {
  title: string;
  path: string;
  status: SketchbookStatus;
  dialogOpen: boolean;
  exportStatus: 'quiescent' | 'requested' | 'exporting';
}
