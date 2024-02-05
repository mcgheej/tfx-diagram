import {
  currentVersion,
  SketchbookFileData,
} from '@tfx-diagram/electron-renderer-web-context-bridge-api';
import { BrowserWindow, dialog } from 'electron';
import { fileRead } from './file-read';
// import * as path from 'path';
// import { fileWrite } from './file-write';

export const fileOpen = (browserWindow: BrowserWindow): SketchbookFileData | null => {
  const filePath = dialog.showOpenDialogSync(browserWindow, {
    filters: [
      {
        name: 'sketchbook',
        extensions: ['tfx'],
      },
    ],
  });
  if (filePath) {
    const data = fileRead(filePath[0]);
    const fileData = JSON.parse(data) as SketchbookFileData;
    if (fileData && fileData.version.id === currentVersion.id) {
      return fileData;
    }
    throw Error('File version incompatible');
  }
  return null;
};
