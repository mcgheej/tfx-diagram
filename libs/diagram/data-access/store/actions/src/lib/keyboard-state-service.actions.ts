import { createAction, props } from '@ngrx/store';
import { TextCursorCommandCodes } from '@tfx-diagram/electron-renderer-web/shared-types';

export const NAVIGATE_TEXT_CURSOR = '[Keyboard State Service] Navigate Text Cursor';
export const navigateTextCursor = createAction(
  NAVIGATE_TEXT_CURSOR,
  props<{ command: TextCursorCommandCodes; extendSelection: boolean }>()
);

export const textEditChange = createAction(
  '[Keyboard State Service] Text Edit Change',
  props<{ shapeId: '' }>()
);

export const printableCharPressed = createAction(
  '[Keyboard State Service] Printable Char Press',
  props<{ key: string }>()
);

export const deleteKeypress = createAction('[Keyboard State Service] Delete Keypress');

export const backspaceKeypress = createAction('[Keyboard State Service] Backspace Keypress');
