import { SaveFileResult, SketchbookFileData } from './electron-renderer-web-shared-types';

export type ContextBridgeApi = {
  // Renderer ==> Main
  getAppVersion: () => Promise<string>;
  minimizeWindow: () => Promise<void>;
  restoreDown: () => Promise<void>;
  maximizeWindow: () => Promise<void>;
  closeWindow: () => void;
  openFile: () => Promise<SketchbookFileData | null>;
  saveFile: (data: SketchbookFileData) => Promise<SaveFileResult | null>;
  saveFileAs: (data: SketchbookFileData) => Promise<SaveFileResult | null>;
  exportJpeg: (data: string) => Promise<void>;

  // Main ==> Renderer
  platform: string;
  maximizeWindowEvent: (fnc: () => void) => void;
  unmaximizeWindowEvent: (fnc: () => void) => void;
};
