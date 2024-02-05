---
sidebar_position: 4
custom_edit_url: null
---

# Save Close Machine Actions

## saveStart

The *SaveCloseMachineActions.saveStart* action is dispatched just before the save/close xstate machine opens a save/discard/cancel dialog. This happens whenever the user requests a file operation that would result in a currently opened modified sketchbook needing to be closed before the file operation (new sketchbook, open sketchbook, or close sketchbook) can proceed. The save/close machine is also used when the user requests to exit the application.

The action is defined as:

```ts
export const saveStart = createAction(
  '[Save/Close] Start Save'
);
```

The action sequence triggered by this action is:

```text
SaveCloseMachineActions.saveStart
|
 - sketchbookReducer -> status = 'saving'
 - sketchbookReducer -> dialogOpen = true
```

## cancelClick

This *SaveCloseMachineActions.cancelClick* action is dispatched when the user clicks the Cancel button on the Save/discard/cancel dialog. This choice instructs the application to cancel whatever file operation or application exit requested and return to editing the currently open sketchbook.

The action is defined as:

```ts
export const cancelClick = createAction(
  '[Save/Close] Cancel Click'
);
```

The action sequence triggered is:

```text
SaveCloseMachineActions.cancelClick
|
 - sketchbookReducer -> status = 'modified'
 - sketchbookReducer -> dialogOpen = false
```

## discardClick

This *SaveCloseMachineActions.discardClick* action is dispatched when the user clicks the Discard button on the Save/discard/cancel dialog. This choice instructs the application to discard any changes made to the currently open sketchbook since it was last saved, close the sketchbook, and then proceed with whatever file operation or application exit was requested.

The action is defined as:

```ts
export const discardClick = createAction(
  '[Save/Close] Discard Click'
);
```

The action sequence triggered is:

```text
SaveCloseMachineActions.discardClick
|
 - sketchbookReducer -> status = 'closing'
 - sketchbookReducer -> dialogOpen = false
```

## saveClick

This *SaveCloseMachineActions.saveClick* action is dispatched when the user clicks the Save button on the Save/discard/cancel dialog. This choice instructs the application to save any changes made to the currently open sketchbook since it was last saved, close the sketchbook, and then proceed with whatever file operation or application exit was requested.

The action is defined as:

```ts
export const saveClick = createAction(
  '[Save/Close] Save Click'
);
```

The action sequence triggered is:

```text
SaveCloseMachineActions.saveClick
|
 - sketchbookReducer -> status = 'saving'
 - sketchbookReducer -> dialogOpen = false
|
 - SketchbookEffects
   saveSketchbook$ -> The effect requests the Electron main process
   |  |  |            to open the system Save File As dialog to save a
   |  |  |            the sketchbook as a file if it hasn\'t been saved
   |  |  |            before, or simply save the sketchbook to the file
   |  |  |            already used. There are three potential outcomes;
   |  |  |            saveCancel, saveError, and saveSuccess.
   |  |  |
   |  |   - saveCancel -> dispatch SketchbookEffects.saveCancel;
   |  |     |
   |  |      - sketchbookReducer -> status = 'modified'
   |  |
   |   - saveError -> dispatch SketchbookEffects.saveError
   |     |
   |      - sketchbookReducer -> status = 'modified'
   |
    - saveSuccess -> dispatch SketchbookEffectsActions.saveSuccess
      |
       - sketchbookReducer -> title = (returned from save as dialog or
                              previous title), path = (returned from
                              save as dialog or previous path),
                              status = 'saved'
```

## closeStart

The *SaveCloseMachineActions.closeStart* action is dispatched when the xstate machine determines the currently open sketchbook should be closed. This happens when the user has saved any modifications or decided to discard any changes.

The action is defined as:

```ts
export const startClose = createAction(
  '[Save/Close] Start Close'
);
```

The action sequence triggered is:

```text
SaveCloseMachineActions.closeStart
|
 - sketchbookReducer -> status = 'closing'
|
 - SketchbookEffects
   closeSketchbook$ -> dispatch SketchbookEffectsActions.pagesClose
   |
    - shapesReducer -> state = initialState
   |
    - pagesReducer -> pages = {}
   |
    - PagesEffects
      closePages$ -> dispatch PagesEffectsActions.sketchbookClose
      |
       - sketchbookReducer -> reset to initialState
      |
       - transformReducer -> reset to initialState
      |
       - controlFrameReducer -> reset to initialState
```
