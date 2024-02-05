import { createReducer, on } from '@ngrx/store';
import { Shape } from '@tfx-diagram/diagram-data-access-shape-base-class';
import {
  ControlFrameEffectsActions,
  DiagramCanvasDirectiveActions,
  KeyboardStateServiceActions,
  MouseMachineActions,
  PagesEffectsActions,
  ShapesEffectsActions,
  SketchbookViewComponentActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { Handle } from '@tfx-diagram/diagram/data-access/shape-classes';
import { TextBlock, TextBox, TextEdit } from '@tfx-diagram/diagram/data-access/text-classes';
import { ControlFrameState } from '@tfx-diagram/electron-renderer-web-context-bridge-api';
import { TextCursorCommandCodes } from '@tfx-diagram/electron-renderer-web/shared-types';

export const initialState: ControlFrameState = {
  highlightedShapeId: '',
  highlightFrameStart: '',
  selectedShapeIds: [],
  selectionFrameStart: '',
  controlShapes: new Map<string, Shape>(),
  dragType: 'none',
  dragOffset: { x: 0, y: 0 },
  selectionBoxAnchor: { x: 0, y: 0 },
  textEdit: null,
  textCursorPosition: null,
  connectionHook: null,
};

export const controlFrameReducer = createReducer(
  initialState,
  on(MouseMachineActions.highlightedShapeIdChange, (state, { id }) => {
    const newState = clearCurrentHandleHighlight(state);
    return setNewHighlight(newState, id);
  }),
  on(ControlFrameEffectsActions.highlightFrameChange, (state, { frameShapes }) => {
    return doHighlightFrameChange(state, frameShapes);
  }),
  on(ControlFrameEffectsActions.selectionChange, (state, { selectedShapeIds, frameShapes }) => {
    return doSelectionChange(state, selectedShapeIds, frameShapes);
  }),
  on(
    ControlFrameEffectsActions.dragStartSelectionBox,
    (state, { mousePagePos, selectionBox }) => {
      const newState = doSelectionChange(state, [], [selectionBox]);
      return {
        ...newState,
        dragType: 'selection-box',
        selectionBoxAnchor: { ...mousePagePos },
      };
    }
  ),
  on(ControlFrameEffectsActions.dragMoveSelectionBox, (state, { selectionBox }) => {
    const newControlShapes = new Map<string, Shape>(state.controlShapes);
    newControlShapes.set(selectionBox.id, selectionBox);
    return {
      ...state,
      controlShapes: newControlShapes,
    };
  }),
  on(
    ControlFrameEffectsActions.dragEndSelectionBox,
    (state, { selectedShapeIds, controlFrame }) => {
      const newState = doSelectionChange(state, selectedShapeIds, controlFrame);
      return {
        ...newState,
        dragType: 'none',
      };
    }
  ),
  on(
    ControlFrameEffectsActions.dragStartSingleSelection,
    (state, { dragOffset, frameShapes }) => {
      const newState = doSelectionChange(state, state.selectedShapeIds, frameShapes);
      return {
        ...newState,
        dragType: 'single-selection',
        dragOffset,
      };
    }
  ),
  on(ControlFrameEffectsActions.dragMoveSingleSelection, (state, { controlShapes }) => {
    const movedControlShapes = new Map<string, Shape>(state.controlShapes);
    for (const controlShape of controlShapes) {
      movedControlShapes.set(controlShape.id, controlShape);
    }
    return {
      ...state,
      controlShapes: movedControlShapes,
    };
  }),
  on(
    ControlFrameEffectsActions.dragEndSingleSelection,
    (state, { selectedShapeIds, frameShapes }) => {
      const newState = doSelectionChange(state, selectedShapeIds, frameShapes);
      return {
        ...newState,
        dragType: 'none',
      };
    }
  ),
  on(ControlFrameEffectsActions.dragStartMultiSelection, (state, { dragOffset }) => {
    return {
      ...state,
      dragType: 'multi-selection',
      dragOffset,
    };
  }),
  on(ControlFrameEffectsActions.dragMoveMultiSelection, (state, { controlShapes }) => {
    const movedControlShapes = new Map<string, Shape>(state.controlShapes);
    for (const controlShape of controlShapes) {
      movedControlShapes.set(controlShape.id, controlShape);
    }
    return {
      ...state,
      controlShapes: movedControlShapes,
      connectionHook: null,
    };
  }),
  on(ControlFrameEffectsActions.dragMoveHandle, (state, { controlShapes, connectionHook }) => {
    const movedControlShapes = new Map<string, Shape>(state.controlShapes);
    for (const controlShape of controlShapes) {
      movedControlShapes.set(controlShape.id, controlShape);
    }
    return {
      ...state,
      controlShapes: movedControlShapes,
      connectionHook,
    };
  }),
  on(ControlFrameEffectsActions.dragEndMultiSelection, (state) => {
    return {
      ...state,
      dragType: 'none',
    };
  }),
  on(
    ControlFrameEffectsActions.dragStartHandle,
    (state, { dragOffset, controlShapes, connectionHook }) => {
      const updatedControlShapes = updateControlShapes(state.controlShapes, controlShapes);
      return {
        ...state,
        dragType: 'handle',
        dragOffset,
        controlShapes: updatedControlShapes,
        connectionHook,
      };
    }
  ),
  on(ControlFrameEffectsActions.dragEndHandle, (state, { controlShapes }) => {
    const updatedControlShapes = updateControlShapes(state.controlShapes, controlShapes);
    return {
      ...state,
      dragType: 'none',
      controlShapes: updatedControlShapes,
      connectionHook: null,
    };
  }),
  on(
    SketchbookViewComponentActions.currentPageChange,
    SketchbookViewComponentActions.addPageConfirmed,
    SketchbookViewComponentActions.deletePageClick,
    SketchbookViewComponentActions.pageOrderChange,
    (state) => {
      return doSelectionChange(state, [], []);
    }
  ),
  on(PagesEffectsActions.sketchbookClose, () => {
    return initialState;
  }),
  on(
    ControlFrameEffectsActions.editTextChange,
    KeyboardStateServiceActions.textEditChange,
    (state, { shapeId }) => {
      const textBlock = TextBox.textBlockCache.get(shapeId);
      const endInsertPosition = textBlock ? textBlock.parentProps.text.length : 0;
      return {
        ...state,
        textEdit: shapeId
          ? new TextEdit({
              associatedShapeId: shapeId,
              selectionSpan: { start: endInsertPosition, end: 0 },
            })
          : null,
      };
    }
  ),
  on(DiagramCanvasDirectiveActions.textCursorPositionChange, (state, { position }) => {
    return {
      ...state,
      textCursorPosition: position,
    };
  }),
  on(KeyboardStateServiceActions.navigateTextCursor, (state, { command, extendSelection }) => {
    let newState = state;
    if (state.textEdit) {
      const textBlock = TextBox.textBlockCache.get(state.textEdit.associatedShapeId);
      if (textBlock) {
        newState = processTextEditNavCode(
          state,
          state.textEdit,
          textBlock,
          command,
          extendSelection
        );
      }
    }
    return newState;
  }),
  on(ControlFrameEffectsActions.editTextClick, (state, { insertPosition }) => {
    if (state.textEdit && insertPosition !== state.textEdit.insertPosition) {
      const newTextEdit = new TextEdit({
        associatedShapeId: state.textEdit.associatedShapeId,
        insertPosition,
      });
      const newCursorPos = newTextEdit.cursorPosition();
      return {
        ...state,
        textEdit: newTextEdit,
        textCursorPosition: newCursorPos,
      };
    }
    return state;
  }),
  on(ShapesEffectsActions.textInsertPositionChange, (state, { newInsertPosition }) => {
    if (state.textEdit) {
      const newTextEdit = new TextEdit({
        associatedShapeId: state.textEdit.associatedShapeId,
        insertPosition: newInsertPosition,
      });
      return {
        ...state,
        textEdit: newTextEdit,
      };
    }
    return state;
  })
);

const processTextEditNavCode = (
  state: ControlFrameState,
  textEdit: TextEdit,
  textBlock: TextBlock,
  command: TextCursorCommandCodes,
  extendSelection: boolean
): ControlFrameState => {
  const newTextEdit = new TextEdit({
    associatedShapeId: textEdit.associatedShapeId,
    insertPosition: textEdit.insertPosition,
    selectionSpan: { ...textEdit.selectionSpan },
  });
  switch (command) {
    case 'NextChar': {
      newTextEdit.insertPosition++;
      if (newTextEdit.insertPosition > textBlock.parentProps.text.length) {
        newTextEdit.insertPosition = textBlock.parentProps.text.length;
      }
      break;
    }
    case 'PrevChar': {
      newTextEdit.insertPosition--;
      if (newTextEdit.insertPosition < 0) {
        newTextEdit.insertPosition = 0;
      }
      break;
    }
    case 'EndWord': {
      const text = textBlock.parentProps.text;
      const i = text.slice(textEdit.insertPosition).search(/\b\W/);
      if (i === -1) {
        newTextEdit.insertPosition = text.length;
      } else {
        newTextEdit.insertPosition = newTextEdit.insertPosition + i;
      }
      break;
    }
    case 'StartWord': {
      const text = textBlock.parentProps.text;
      let lastWordStart = 0;
      newTextEdit.insertPosition = 0;
      for (let i = 0; i < text.length; i++) {
        let wordStart = text.slice(i).search(/\W\b/);
        if (wordStart === -1) {
          newTextEdit.insertPosition = lastWordStart;
          i = text.length;
        } else {
          wordStart += i + 1;
          if (wordStart >= textEdit.insertPosition) {
            newTextEdit.insertPosition = lastWordStart;
            i = text.length;
          } else {
            lastWordStart = wordStart;
          }
        }
      }
      break;
    }
    case 'StartText': {
      newTextEdit.insertPosition = 0;
      break;
    }
    case 'EndText': {
      newTextEdit.insertPosition = textBlock.parentProps.text.length;
      break;
    }
    case 'StartLine': {
      const lineIndex = textBlock.findLineIndex(textEdit.insertPosition);
      if (lineIndex < 0 || lineIndex >= textBlock.lines.length) {
        return state;
      }
      newTextEdit.insertPosition = textBlock.lines[lineIndex].startInsertPosition;
      break;
    }
    case 'EndLine': {
      const lineIndex = textBlock.findLineIndex(textEdit.insertPosition);
      if (lineIndex < 0 || lineIndex >= textBlock.lines.length) {
        return state;
      }
      newTextEdit.insertPosition = textBlock.lines[lineIndex].endInsertPosition;
      break;
    }
    case 'UpLine': {
      const lineIndex = textBlock.findLineIndex(textEdit.insertPosition);
      if (lineIndex < 1 || lineIndex >= textBlock.lines.length) {
        newTextEdit.insertPosition = 0;
      } else {
        const offsetInsertPoint =
          textEdit.insertPosition - textBlock.lines[lineIndex].startInsertPosition;
        newTextEdit.insertPosition = Math.min(
          textBlock.lines[lineIndex - 1].startInsertPosition + offsetInsertPoint,
          textBlock.lines[lineIndex - 1].endInsertPosition
        );
      }
      break;
    }
    case 'DownLine': {
      const lineIndex = textBlock.findLineIndex(textEdit.insertPosition);
      if (lineIndex < 0 || lineIndex >= textBlock.lines.length - 1) {
        newTextEdit.insertPosition = textBlock.parentProps.text.length;
      } else {
        const offsetInsertPoint =
          textEdit.insertPosition - textBlock.lines[lineIndex].startInsertPosition;
        newTextEdit.insertPosition = Math.min(
          textBlock.lines[lineIndex + 1].startInsertPosition + offsetInsertPoint,
          textBlock.lines[lineIndex + 1].endInsertPosition
        );
      }
      break;
    }
    default:
      return state;
  }
  if (extendSelection) {
    newTextEdit.changeSelectionSpan(newTextEdit.insertPosition);
  } else {
    newTextEdit.resetSelectionSpan(newTextEdit.insertPosition);
  }
  const newCursorPos = newTextEdit.cursorPosition();
  return {
    ...state,
    textCursorPosition: newCursorPos,
    textEdit: newTextEdit,
  };
};

const updateControlShapes = (
  controlShapes: Map<string, Shape>,
  modifiedShapes: Shape[]
): Map<string, Shape> => {
  const result = new Map<string, Shape>(controlShapes);
  for (const modifiedShape of modifiedShapes) {
    result.set(modifiedShape.id, modifiedShape);
  }
  return result;
};

const clearCurrentHandleHighlight = (state: ControlFrameState): ControlFrameState => {
  const highlightedShape = state.controlShapes.get(state.highlightedShapeId);
  if (highlightedShape) {
    if (highlightedShape.shapeType === 'handle') {
      const modifiedControlShapes = new Map<string, Shape>(state.controlShapes);
      modifiedControlShapes.set(
        highlightedShape.id,
        (highlightedShape as Handle).copy({ highlightOn: false })
      );
      return {
        ...state,
        controlShapes: modifiedControlShapes,
      };
    }
  }
  return state;
};

const setNewHighlight = (
  state: ControlFrameState,
  newHighlightId: string
): ControlFrameState => {
  const newHighlightedShape = state.controlShapes.get(newHighlightId);
  if (newHighlightedShape) {
    if (newHighlightedShape.shapeType === 'handle') {
      const modifiedControlShapes = new Map<string, Shape>(state.controlShapes);
      modifiedControlShapes.set(
        newHighlightedShape.id,
        (newHighlightedShape as Handle).copy({ highlightOn: true })
      );
      return {
        ...state,
        controlShapes: modifiedControlShapes,
        highlightedShapeId: newHighlightId,
      };
    }
  }
  return {
    ...state,
    highlightedShapeId: newHighlightId,
  };
};

const doHighlightFrameChange = (
  state: ControlFrameState,
  frameShapes: Shape[]
): ControlFrameState => {
  const newControlShapes = new Map(state.controlShapes);
  // Remove any existing highlight shapes
  let id = state.highlightFrameStart;
  while (id) {
    const shape = newControlShapes.get(id);
    if (shape) {
      const nextId = shape.nextShapeId;
      newControlShapes.delete(id);
      Shape.shapeIdsMap.delete(id);
      id = nextId;
    } else {
      id = '';
    }
  }
  // Add new highlight shapes
  let highlightFrameStart = '';
  if (frameShapes.length > 0) {
    highlightFrameStart = frameShapes[0].id;
    for (let i = 0; i < frameShapes.length; i++) {
      newControlShapes.set(frameShapes[i].id, frameShapes[i]);
    }
  }
  return {
    ...state,
    highlightFrameStart,
    controlShapes: newControlShapes,
  };
};

const doSelectionChange = (
  state: ControlFrameState,
  selectedShapeIds: string[],
  frameShapes: Shape[]
): ControlFrameState => {
  const newControlShapes = new Map(state.controlShapes);
  // Remove any existing selection shapes
  let id = state.selectionFrameStart;
  while (id) {
    const existingFrameShape = newControlShapes.get(id);
    if (existingFrameShape) {
      const nextId = existingFrameShape.nextShapeId;
      newControlShapes.delete(id);
      Shape.shapeIdsMap.delete(id);
      id = nextId;
    } else {
      id = '';
    }
  }
  // Add new selection shapes
  let selectionFrameStart = '';
  if (frameShapes.length > 0) {
    selectionFrameStart = frameShapes[0].id;
    for (let i = 0; i < frameShapes.length; i++) {
      newControlShapes.set(frameShapes[i].id, frameShapes[i]);
    }
  }
  if (state.textEdit) {
    if (
      selectedShapeIds.length !== 1 ||
      state.textEdit.associatedShapeId !== selectedShapeIds[0]
    ) {
      return {
        ...state,
        selectedShapeIds,
        selectionFrameStart,
        controlShapes: newControlShapes,
        textEdit: null,
      };
    }
  }
  return {
    ...state,
    selectedShapeIds,
    selectionFrameStart,
    controlShapes: newControlShapes,
  };
};
