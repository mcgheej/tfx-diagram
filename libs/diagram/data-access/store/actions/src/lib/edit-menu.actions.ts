import { createAction, props } from '@ngrx/store';
import { TextEdit } from '@tfx-diagram/diagram/data-access/text-classes';

export const duplicateClick = createAction(
  '[Edit Menu] Duplicate Click',
  props<{ selectedShapeIds: string[] }>()
);

export const deleteClick = createAction(
  '[Edit Menu] Delete Click',
  props<{ selectedShapeIds: string[]; textEdit: TextEdit | null }>()
);

export const copyClick = createAction(
  '[Edit Menu] Copy Click',
  props<{ selectedShapeIds: string[]; textEdit: TextEdit | null }>()
);

export const cutClick = createAction(
  '[Edit Menu] Cut Click',
  props<{ selectedShapeIds: string[]; textEdit: TextEdit | null }>()
);

export const pasteClick = createAction(
  '[Edit Menu] Paste Click',
  props<{ textEdit: TextEdit | null }>()
);
