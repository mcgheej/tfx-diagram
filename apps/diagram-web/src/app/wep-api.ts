import {
  ContextBridgeApi,
  SaveFileResult,
  SketchbookFileData,
} from '@tfx-diagram/electron-renderer-web-context-bridge-api';

export const webApi: ContextBridgeApi = {
  getAppVersion: () => new Promise<string>((myResolve) => myResolve('web app')),
  platform: 'unknown',
  minimizeWindow: () => new Promise<void>((myResolve) => myResolve()),
  restoreDown: () => new Promise<void>((myResolve) => myResolve()),
  maximizeWindow: () => new Promise<void>((myResolve) => myResolve()),
  closeWindow: () => null,
  openFile: () => new Promise<SketchbookFileData | null>((myResolve) => myResolve(null)),
  saveFile: (data: SketchbookFileData) =>
    new Promise<SaveFileResult | null>((myResolve) =>
      myResolve({ title: data.sketchbook.title, path: 'c:\\' })
    ),
  saveFileAs: (data: SketchbookFileData) =>
    new Promise<SaveFileResult | null>((myResolve) =>
      myResolve({ title: data.sketchbook.title, path: 'c:\\' })
    ),
  exportJpeg: (data: string) => new Promise<void>((myResolve) => myResolve()),

  maximizeWindowEvent: () => null,
  unmaximizeWindowEvent: () => null,
};
