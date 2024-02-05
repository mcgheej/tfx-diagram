import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Shape } from '@tfx-diagram/diagram-data-access-shape-base-class';
import {
  ControlFrameEffectsActions,
  MouseMachineActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { Group } from '@tfx-diagram/diagram/data-access/shape-classes';
import { selectShapes } from '@tfx-diagram/diagram/data-access/store/features/shapes';
import { TextBox, TextEdit } from '@tfx-diagram/diagram/data-access/text-classes';
import { EDIT_TEXT_ID, Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { filter, of, switchMap } from 'rxjs';
import {
  selectHighlightedShapeId,
  selectSelectedShapeIds,
  selectTextEdit,
} from '../control-frame.feature';

export const leftButtonDown = (actions$: Actions<Action>, store: Store) => {
  return createEffect(() => {
    return actions$.pipe(
      ofType(MouseMachineActions.leftButtonDown),
      concatLatestFrom(() => [
        store.select(selectHighlightedShapeId),
        store.select(selectShapes),
        store.select(selectSelectedShapeIds),
        store.select(selectTextEdit),
      ]),
      filter(([, highlightedShapeId, shapes, selectedShapeIds]) => {
        // Only continue if the left button down is on the page background,
        // editing text, or on a selectable shape, other than a handle, that
        // is not selected already
        if (highlightedShapeId === '') {
          return true;
        }
        if (highlightedShapeId === EDIT_TEXT_ID) {
          return true;
        }
        if (
          selectedShapeIds.includes(Group.topLevelGroupIdFromId(highlightedShapeId, shapes))
        ) {
          return false;
        }
        const shape = shapes.get(highlightedShapeId);
        if (shape && shape.selectable) {
          return true;
        }
        return false;
      }),
      switchMap(([{ x, y }, highlightedShapeId, shapes, , textEdit]) => {
        if (textEdit && highlightedShapeId === EDIT_TEXT_ID) {
          // User clicked on text under edit. Find insert point
          // from cursor position
          return of(
            ControlFrameEffectsActions.editTextClick({
              insertPosition: calcNewInsertPoint(textEdit, { x, y }),
            })
          );
        }
        const selectedShape = shapes.get(highlightedShapeId);
        if (highlightedShapeId === '' || selectedShape === undefined) {
          // left mouse button down on page background therefore clear any existing
          // shape selections
          return of(
            ControlFrameEffectsActions.selectionChange({
              selectedShapeIds: [],
              frameShapes: [],
            })
          );
        }
        // return action that will clear current selection and then set
        // up new single selection for the shape.
        if (selectedShape.groupId) {
          return of(
            ControlFrameEffectsActions.selectionChange({
              selectedShapeIds: [Group.topLevelGroupIdFromId(highlightedShapeId, shapes)],
              frameShapes: (selectedShape as Shape).selectFrame(shapes),
            })
          );
        }
        return of(
          ControlFrameEffectsActions.selectionChange({
            selectedShapeIds: [highlightedShapeId],
            frameShapes: (selectedShape as Shape).selectFrame(shapes),
          })
        );
      })
    );
  });
};

const calcNewInsertPoint = (textEdit: TextEdit, clickPos: Point): number => {
  const textBlock = TextBox.textBlockCache.get(textEdit.associatedShapeId);
  if (textBlock) {
    const insertPosition = textBlock.findInsertPositionFromPoint(clickPos);
    if (insertPosition >= 0) {
      return insertPosition;
    }
  }
  return textEdit.insertPosition;
};
