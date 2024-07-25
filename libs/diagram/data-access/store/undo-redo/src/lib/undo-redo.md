# Undo / Redo Feature

Undo/redo is a familiar feature in modern applications. As a user works with data there is inevitably a need to undo an operation made in error, whether that is recovering an accidentally deleted item to putting a drawing element back where it was after an experimental repositioning. Redo is the natural companion to Undo, letting the user go back to where things were before the undo.

The implementation of Undo/Redo in TfxDiagram has been inspired by an excellent post titled "Implementing Undo-Redo with NgRx or Redux" by Nils Mehlhorn. The post discusses three ways to approach an undo-redo implmentation; saving and restoring states, saving and rerunning actions and saving and applying JSON patches.

The implementation in TfxDiagram uses a modified saving and restoring states method.

## User Operations and Trigger Actions

An undo function needs to "undo" the result of a user operation that affects the state of the application. To do this the undo-redo feature must be able to detect when a user operation that could be undone is initiated by the user. This is achieved by implementing a meta-reducer that monitors NgRx actions looking for specific trigger actions that indicate an operation request.

Trigger actions fall into three categories; regular, irregular and modal.

A regular trigger action indicates a user operation that is always undoable, an irregular trigger action indicates a user operation that may be undoable depending on the current application state, and modal trigger actions do not indicate the start of an undoable operation but do affect the state of the undo/redo feature.

## Application State and State History

TfxDiagram uses the NgRx library to manage its state, defined by the interface _AppState_.

```ts
export interface AppState {
  colors: ColorsState;
  controlFrame: ControlFrameState;
  pages: PagesState;
  settings: SettingsState;
  shapes: ShapesState;
  sketchbook: SketchbookState;
  transform: TransformState;
}
```

When saving state snapshots for undo/redo TfxDiagram uses objects of type _StateHistory_.

```ts
export interface StateHistory {
  actionType: string;
  state: AppState;
}
```

_actionType_ is the type for the trigger action and _state_ is the state snapshot before the operation begins.

## Stacking States

Most implementations of undo/redo allow the user to undo multiple operations one by one, essentially turning the clock back. TfqDiagram uses two stack data structures (last in first out) to manage state history; _undoStack_ and _redoStack_.

```ts
export const undoStack = new Stack<StateHistory>(10, 'undo');
export const redoStack = new Stack<StateHistory>(10, 'redo');
```

The undo/redo meta-reducer checks NgRx actions to see whether or not they are:

1. Trigger actions that indicate a user operation that could be undone has been requested. These are regular trigger actions or irregular trigger actions that meet their specific state requirements (see section below on trigger action details). If the operation can be undone then first push the current state and action type as a _StateHistory_ object to the _undoStack_. Next clear the _redoStack_ as adding something to the _undoStack_ means redo is no longer a valid operation.

2. Next check for modal trigger actions that cancel undo/redo, e.g. changing the viewport size or saving the current diagram to file. These trigger actions result in clearing the _undoStack_ and the _redoStack_.

3. Check for the modal trigger action that indicates the end of a selection box drag. This requires some special processing if the selection box is empty that may result in the last pushed entry in the _undoStack_ being discarded. This is to avoid an unnecesary state (no selection) being retained in the stack.

4. Check for the undo action request. If this happens then pop the last saved StateHistory object from the _undoStack_. If there was a state to pop the save the current state to the _redoStack_, save the settings from the popped state to local storage and flush the TextBox TextBlockCache to ensure font props are properly recovered. Finally return the popped state to undo the last operation.

5. Checkfor the redo action request. Pop the last saved StateHistory object from the _redoStack_. If there was a state to pop save the current state to the _undoStack_, save the settings from the popped state to local storage and flush the TextBox TextBlockCache to ensure font props are properly recovered. Finally return the popped state to complete the redo request.

## Trigger Actions - Details

### Regular Trigger Actions

Regular trigger actions are simply defined as triggers that will always result in the current application state being pushed to the _Undo Stack_. The majority of trigger actions fall into this category. The regular trigger actions and their associated user operations are listed in the table below.

| Trigger Action                                      | User Operation                    |
| --------------------------------------------------- | --------------------------------- |
| SketchbookViewComponentActions.addPageConfirmed     | Add Page                          |
| SketchbookViewComponentActions.pageTitleChange      | Rename Page                       |
| SketchbookViewComponentActions.pageOrderChange      | Move Page                         |
| SketchbookViewComponentActions.deletePageClick      | Delete Page                       |
| SketchbookViewComponentActions.currentPageChange    | Change Current Page               |
| ViewMenuActions.pageAlignmentChange                 | Page Alignment Change             |
| ViewMenuActions.shapeSnapToggle                     | Shape Snap Toggle                 |
| ViewMenuActions.showMousePositionToggle             | Mouse Position Toggle             |
| ViewMenuActions.mousePositionCoordsTypeChange       | Mouse Position Coords Type Change |
| ViewMenuActions.showGridToggle                      | Show Grid Toggle                  |
| ViewMenuActions.snapToGridToggle                    | Snap To Grid Toggle               |
| ViewMenuActions.screenPixelDensityChange            | Screen Pixel Density Change       |
| ViewMenuActions.zoomChange                          | Zoom Change                       |
| SketchbookViewComponentActions.zoomChange           | Zoom Change (Zoom Control)        |
| InsertMenuActions.insertCircle                      | Insert Circle                     |
| InsertMenuActions.insertRectangle                   | Insert Rectangle                  |
| InsertMenuActions.insertArc                         | Insert Arc                        |
| InsertMenuActions.insertCurve                       | Insert Curve                      |
| InsertMenuActions.insertLine                        | Insert Line                       |
| InsertMenuActions.insertTriangle                    | Insert Triangle                   |
| FontFamilyButtonServiceActions.fontPropsChange      | Font Family Change                |
| FontControlsComponentActions.fontPropsChange        | Font Size Increase                |
| FontControlsComponentActions.fontPropsChange        | Font Size Decrease                |
| FontControlsComponentActions.fontPropsChange        | Font Bold Toggle                  |
| FontControlsComponentActions.fontPropsChange        | Font Italicise Toggle             |
| FontControlsComponentActions.fontPropsChange        | Font Underline Toggle             |
| FontSizeButtonServiceActions.fontPropsChange        | Font Size Change                  |
| ColorButtonsServiceActions.fontPropsChange          | Font Colour Change                |
| TextOptionsServiceActions.fontPropsChange           | Font Alignment and Indents Change |
| ColorButtonsServiceActions.fillColorChange          | Fill Colour Change                |
| ColorButtonsServiceActions.lineColorChange          | Line Colour Change                |
| LineWidthButtonServiceActions.lineWidthChange       | Line Width Change                 |
| LineDashButtonServiceActions.lineDashChange         | Line Dash Change                  |
| EndpointButtonsServiceActions.startEndpointChange   | Start Endpoint Change             |
| EndpointButtonsServiceActions.finishEndpointChange  | Finish Endpoint Change            |
| SelectionMenuActions.selectAllClick                 | Select All Shapes                 |
| SelectionMenuActions.inverseSelectionClick          | Invert Selection                  |
| ArrangeMenuActions.bringToFrontClick                | Bring Shape To Front              |
| ArrangeMenuActions.sendToBackClick                  | Send Shape To Back                |
| ArrangeMenuActions.bringItemForward                 | Bring Shape Forward               |
| ArrangeMenuActions.sendItemBackward                 | Send Shape Backward               |
| ArrangeMenuActions.groupClick                       | Group Selected Shapes             |
| ArrangeMenuActions.ungroupClick                     | Ungroup Selected Groups           |
| ArrangeMenuActions.alignObjectsClick                | Align Selected Shapes             |
| ArrangeMenuActions.distributeObjectsClick           | Distribute Selected Shapes        |
| ArrangeMenuActions.shapeResizeClick                 | Resize Selected Shapes            |
| EditMenuActions.deleteClick                         | Delete Selected Shapes            |
| ControlFrameEffectsActions.dragStartHandle          | Change Shape With Mouse Drag      |
| ControlFrameEffectsActions.dragStartSingleSelection | Move Selected Shape               |
| ControlFrameEffectsActions.dragStartMultiSelection  | Move Selected Shapes              |

### Irregular Trigger Actions

Regular trigger actions are simply defined as triggers that will always result in the current application state being pushed to the _Undo Stack_. The majority of trigger actions fall into this category. The regular trigger actions and their associated user operations are listed in the table below.

Irregular trigger actions may or may not result in the current application state being pushed to the _Undo Stack_. The logic to determine whether or not the state should be saved is dependent on the action trigger. The table below lists the irregular trigger actions.

| Trigger Action                         | User Operation                  |
| -------------------------------------- | ------------------------------- |
| MouseMachineActions.leftButtonDown     | Select Shape                    |
| MouseMachineActions.ctrlLeftButtonDown | Add/Remove Shape From Selection |

#### MouseMachineActions.leftButtonDown

#### MouseMachineActions.ctrlLeftButtonDown

### Modal Trigger Actions

| Trigger Action                                   | User Operation                |
| ------------------------------------------------ | ----------------------------- |
| ControlFrameEffectsActions.dragStartSelectionBox | Select Shapes With Mouse Drag |
