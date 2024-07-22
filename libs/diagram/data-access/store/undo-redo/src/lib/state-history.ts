import { AppState } from '@tfx-diagram/electron-renderer-web-context-bridge-api';
import { Stack } from './stack';

export interface StateHistory {
  actionType: string;
  state: AppState;
}

export const undoStack = new Stack<StateHistory>(20, 'undo');
export const redoStack = new Stack<StateHistory>(20, 'redo');
