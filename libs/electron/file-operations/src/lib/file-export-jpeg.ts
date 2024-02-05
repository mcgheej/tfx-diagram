import { BrowserWindow, dialog } from 'electron';
import { fileWrite } from './file-write';

export const fileExportJpeg = (data: string, browserWindow: BrowserWindow): void => {
  const savePath = dialog.showSaveDialogSync(browserWindow, {
    defaultPath: 'sketchbook',
    filters: [
      {
        name: 'sketchbook',
        extensions: ['jpg', 'jpeg'],
      },
    ],
  });
  if (savePath) {
    fileWrite(savePath, data, true);
  }
};
