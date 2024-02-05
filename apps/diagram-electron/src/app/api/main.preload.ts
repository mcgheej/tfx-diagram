import {
  ContextBridgeApi,
  SketchbookFileData,
} from '@tfx-diagram/electron-renderer-web-context-bridge-api';
import { contextBridge, ipcRenderer } from 'electron';

const exposedApi: ContextBridgeApi = {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  platform: process.platform,
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  restoreDown: () => ipcRenderer.invoke('restore-down-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  closeWindow: () => ipcRenderer.send('quit'),
  openFile: () => ipcRenderer.invoke('open-file'),
  saveFile: (data: SketchbookFileData) => ipcRenderer.invoke('save-file', data),
  saveFileAs: (data: SketchbookFileData) => ipcRenderer.invoke('save-file-as', data),
  exportJpeg: (data: string) => ipcRenderer.invoke('export-jpeg', data),

  maximizeWindowEvent: (fnc: () => void) => {
    ipcRenderer.on('maximize-window-event', () => fnc());
  },
  unmaximizeWindowEvent: (fnc: () => void) => {
    ipcRenderer.on('unmaximize-window-event', () => fnc());
  },
};

contextBridge.exposeInMainWorld('electronApi', exposedApi);
