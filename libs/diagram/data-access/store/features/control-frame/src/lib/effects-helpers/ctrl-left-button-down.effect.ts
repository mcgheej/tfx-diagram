import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Shape } from '@tfx-diagram/diagram-data-access-shape-base-class';
import {
  ControlFrameEffectsActions,
  MouseMachineActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { Group } from '@tfx-diagram/diagram/data-access/shape-classes';
import { selectShapes } from '@tfx-diagram/diagram/data-access/store/features/shapes';
import { filter, of, switchMap } from 'rxjs';
import { selectHighlightedShapeId, selectSelectedShapeIds } from '../control-frame.feature';
import { getMultiSelectControlFrame } from '../misc-functions';

export const ctrlLeftButtonDown = (actions$: Actions<Action>, store: Store) => {
  return createEffect(() => {
    return actions$.pipe(
      ofType(MouseMachineActions.ctrlLeftButtonDown),
      concatLatestFrom(() => [
        store.select(selectHighlightedShapeId),
        store.select(selectShapes),
        store.select(selectSelectedShapeIds),
        // this.store.select(selectControlShapes),
      ]),
      filter(([, highlightedShapeId, shapes]) => {
        // Only continue if the left button down is on the page background or
        // on a selectable shape, other than a handle
        if (highlightedShapeId === '') {
          return true;
        }
        const shape = shapes.get(highlightedShapeId);
        if (shape && shape.selectable) {
          return true;
        }
        return false;
      }),
      switchMap(([, highlightedShapeId, shapes, selectedShapeIds]) => {
        if (highlightedShapeId === '') {
          // ctrl + left button down on page background clears any existing
          // shape selections
          return of(
            ControlFrameEffectsActions.selectionChange({
              selectedShapeIds: [],
              frameShapes: [],
            })
          );
        }
        // Highlighted item id will be id of highlighted shape or highlighted
        // group that contains the shape below the cursor
        const highlightedItemId = Group.topLevelGroupIdFromId(highlightedShapeId, shapes);
        const i = selectedShapeIds.indexOf(highlightedItemId);
        if (i >= 0) {
          // item under mouse is selected so deselect it by removing from shapeIds
          const modifiedSelectedShapeIds = [...selectedShapeIds];
          modifiedSelectedShapeIds.splice(i, 1);
          if (modifiedSelectedShapeIds.length === 1) {
            // Removing selected item has left a single selected item so put up
            // control frame or clear all selections if no item found (should not happen)
            const selectedShape = shapes.get(modifiedSelectedShapeIds[0]);
            if (selectedShape) {
              return of(
                ControlFrameEffectsActions.selectionChange({
                  selectedShapeIds: modifiedSelectedShapeIds,
                  frameShapes: (selectedShape as Shape).selectFrame(shapes),
                })
              );
            }
            return of(
              ControlFrameEffectsActions.selectionChange({
                selectedShapeIds: [],
                frameShapes: [],
              })
            );
          } else if (modifiedSelectedShapeIds.length === 0) {
            // Last selected shape removed so clear selection
            return of(
              ControlFrameEffectsActions.selectionChange({
                selectedShapeIds: [],
                frameShapes: [],
              })
            );
          }
          // Still have multiple shapes selected so refresh control frame
          return of(
            ControlFrameEffectsActions.selectionChange({
              selectedShapeIds: modifiedSelectedShapeIds,
              frameShapes: getMultiSelectControlFrame(modifiedSelectedShapeIds, shapes),
            })
          );
        }
        // New shape added to selection so refresh control frame.
        const shapeIds = [...selectedShapeIds, highlightedItemId];
        return of(
          ControlFrameEffectsActions.selectionChange({
            selectedShapeIds: shapeIds,
            frameShapes: getMultiSelectControlFrame(shapeIds, shapes),
          })
        );
      })
    );
  });
};
