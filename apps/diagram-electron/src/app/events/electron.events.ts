/**
 * This module is responsible on handling all the inter process communications
 * between the frontend to the electron backend.
 */

import {
  SaveFileResult,
  SketchbookFileData,
} from '@tfx-diagram/electron-renderer-web-context-bridge-api';
import { FileOperations } from '@tfx-diagram/electron/file-operations';
import { app, ipcMain } from 'electron';
import { environment } from '../../environments/environment';
import App from '../app';

export default class ElectronEvents {
  static bootstrapElectronEvents(): Electron.IpcMain {
    return ipcMain;
  }
}

// Retrieve app version
ipcMain.handle('get-app-version', () => {
  console.log(`Fetching application version... [v${environment.version}]`);

  return environment.version;
});

ipcMain.handle('minimize-window', () => {
  App.mainWindow.minimize();
});

ipcMain.handle('restore-down-window', () => {
  App.mainWindow.unmaximize();
});

ipcMain.handle('maximize-window', () => {
  App.mainWindow.maximize();
});

ipcMain.handle('open-file', () => {
  let saveResult: SketchbookFileData | null = null;
  try {
    saveResult = FileOperations.fileOpen(App.mainWindow);
  } catch (err) {
    throw Error(err);
  }
  return saveResult;
});

ipcMain.handle('save-file', (_, data: SketchbookFileData) => {
  try {
    FileOperations.fileWrite(data.sketchbook.path, JSON.stringify(data));
  } catch (err) {
    throw Error(err);
  }
});

ipcMain.handle('save-file-as', (_, data: SketchbookFileData) => {
  let saveResult: SaveFileResult | null = null;
  try {
    saveResult = FileOperations.fileSaveAs(data, App.mainWindow);
  } catch (err) {
    throw Error(err);
  }
  return saveResult;
});

ipcMain.handle('export-jpeg', (_, data: string) => {
  try {
    FileOperations.fileExportJpeg(data, App.mainWindow);
  } catch (err) {
    throw Error(err);
  }
});

// Handle App termination
ipcMain.on('quit', (event, code) => {
  app.exit(code);
});
