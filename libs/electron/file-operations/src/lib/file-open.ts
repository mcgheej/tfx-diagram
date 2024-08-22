import {
  currentVersion,
  SketchbookFileData,
} from '@tfx-diagram/electron-renderer-web-context-bridge-api';
import { BrowserWindow, dialog } from 'electron';
import * as path from 'path';
import { fileRead } from './file-read';
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
  if (filePath && filePath.length > 0) {
    const data = fileRead(filePath[0]);
    const fileData = JSON.parse(data) as SketchbookFileData;
    if (fileData && fileData.version.id === currentVersion.id) {
      fileData.sketchbook.title = path.parse(filePath[0]).name;
      fileData.sketchbook.path = filePath[0];
      return fileData;
    }
    throw Error('File version incompatible');
  }
  return null;
};
