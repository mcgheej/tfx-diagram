import {
  SaveFileResult,
  SketchbookFileData,
} from '@tfx-diagram/electron-renderer-web-context-bridge-api';
import { BrowserWindow, dialog } from 'electron';
import * as path from 'path';
import { fileWrite } from './file-write';

export const fileSaveAs = (
  data: SketchbookFileData,
  browserWindow: BrowserWindow
): SaveFileResult | null => {
  const savePath = dialog.showSaveDialogSync(browserWindow, {
    defaultPath: data.sketchbook.title,
    filters: [
      {
        name: 'sketchbook',
        extensions: ['tfx'],
      },
    ],
  });
  let title = data.sketchbook.title;
  if (savePath) {
    title = path.parse(savePath).name;
    data.sketchbook.title = title;
    data.sketchbook.path = savePath;
    fileWrite(savePath, JSON.stringify(data));
    return {
      title,
      path: savePath ?? '',
    };
  }
  return null;
};
