---
sidebar_position: 3
custom_edit_url: null
---

# File Menu Actions

## newSketchbookClick

The *FileMenuActions.newSketchbookClick* action is dispatched to the store when the user clicks the File | New menu item in the app menu system. The action is defined as:

```ts
export const newSketchbookClick = createAction(
  '[File Menu] New Sketchbook Click'
);
```

As shown in the action sequence below this action simply results in the Sketchbook state property *status* being set to 'creating'.

```text
FileMenuActions.newSketchbookClick
|
 - sketchbookReducer -> status = 'creating'
                        dialogOpen = true
```

## newSketchbookCancel

When the user clicks the File | New meu item the command handler dispatches a *FileMenuActions.newSketchbookClick* action to the store (discussed above). The handler then opens a dialog prompting the user to enter a name for the new sketchbook and properties for the first page in the new sketchbook.

If the user cancels the dialog then the command handler dispatches a *FileMenuActions.newSketchbookCancel* action. The action is defined as:

```ts
export const newSketchbookCancel = createAction(
  '[File Menu] New Sketchbook Cancel'
);
```

The action sequence is:

```text
FileMenuActions.newSketchbookCancel
|
 - sketchbookReducer -> status = 'closed'
                        dialogOpen = false
```

As shown the action simply results in the Sketchbook state property *status* being set to 'closed'.

## newSketchbookCreate

If the user completes the new Sketchbook details in the dialog and clicks 'OK' then the command handlers dispatches a *FileMenuActions.newSketchbookCreate* action to the store. The action is defined as:

```ts
export const newSketchbookCreate = createAction(
  '[File Menu] New Sketchbook Create',
  props<{
    sketchbookTitle: string;
    page: Omit<Page, 'id' | 'firstShapeId' | 'zoomFactor' | 'windowCentre'>;
  }>()
);
```

The props values are recovered from the dialog result. The action sequence initiated when *FileMenuActions.newSketchbookCreate* is dispatched is:

```text
FileMenuActions.newSketchbookCreate
|
 - sketchbookReducer -> title = {supplied title}
|                    path = ''
|                    status = 'modified'
|                    dialogOpen = true
|
 - SketchbookEffects
   newSketchbook$ -> dispatch SketchbookEffectsActions.newPageReady
   |
    - pagesReducer -> pages = (add new page object)
   |                  pageIds = (add new page id)
   |                  currentPageId = (id of new page)
   |
    - PagesEffects
      newPageReady$ -> dispatch PagesEffectsActions.pageAdded
      |
       - sketchbookReducer -> pageIds = (add new page id),
      |                       currentPageId = (id of new page)
      |                       status = 'modified'
      |
       - SketchbookEffects
         currentPageChange$ -> dispatch
         |                     SketchbookEffectsActions.currentPageChange
         |
          - TransformEffects
            currentPageChange$ -> dispatch
            |                     TransformEffectsActions.pageWindowChange
            |
             - pagesReducer -> pages = (update windowCentre property
            |                  of current page object)
            |
             - transformReducer => pageWindow, pageSize
            |
             - TransformEffects
               pageWindowChange$ -> dispatch
               |                    TransformEffectsActions.transformChange
               |
                - transform.reducer -> transform
```

This is a fairly long action sequence but the end effect is to have updated the state to incorporate the new sketchbook with a single new page.

## openSketchbookClick

The *FileMenuActions.openSketchbookClick* action is dispatched to the store when the user clicks the File | Open menu item in the app menu system. The action is defined as:

```ts
export const openSketchbookClick = createAction(
  '[File Menu] Open Sketchbook Click'
);
```

The action sequence triggered by the *FileMenuActions.openSketchbookClick* action is again fairly long:

```text
FileMenuActions.openSketchbookClick
|
 - sketchbookReducer -> status = 'loading'
|
 - SketchbookEffects
   openSketchbook$ -> The effect requests the Electron main process
   |  |  |            to open the system Open File dialog to load a
   |  |  |            previously saved file. There are three potential
   |  |  |            outcomes; openCancel, openError, and openSuccess.
   |  |  |
   |  |   - openCancel -> dispatch SketchbookEffects.openCancel;
   |  |     |
   |  |      - sketchbookReducer -> status = 'closed'
   |  |
   |   - openError -> dispatch SketchbookEffects.openError
   |     |
   |      - sketchbookReducer -> status = 'closed'
   |
    - openSuccess -> dispatch SketchbookEffectsActions.openSuccess
      |
       - pagesReducer -> pages = (pages loaded from file)
      |
       - PagesEffects
         openSuccess$ -> dispatch PagesEffectsActions.openSuccess
         |
          - sketchbookReducer -> sketchbookState = (state loaded from file)
         |                       status = 'saved'
         |
          - TransformEffects
            currentPageChange$ -> dispatch TransformEffectsActions.pageWindowChange
            |
             - pagesReducer -> pages = (update windowCentre property of current
            |                  page object)
            |
             - transformReducer => pageWindow, pageSize
            |
             - TransformEffects
               pageWindowChange$ -> dispatch
               |                    TransformEffectsActions.transformChange
               |
                - transform.reducer -> transform
```

## saveSketchbookClick

The *FileMenuActions.saveSketchbookClick* action is dispatched to the store when the user clicks the File | Save menu item in the app menu system. The action is defined as:

```ts
export const saveSketchbookClick = createAction(
  '[File Menu] Save Sketchbook Click'
);
```

The action sequence triggered by this action is:

```text
FileMenuActions.saveSketchbookClick
|
 - sketchbookReducer -> status = 'saving'
|
 - SketchbookEffects
   saveSketchbook$ -> The effect requests the Electron main process
   |  |  |            to open the system Save File As dialog to save
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
