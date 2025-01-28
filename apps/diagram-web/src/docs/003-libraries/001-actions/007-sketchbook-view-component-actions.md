---
sidebar_position: 8
custom_edit_url: null
---

# Sketchbook View Component Actions

## zoomChange

The *SketchbookViewComponentActions.zoomChange* action is dispatched by the SketchbookViewComponent *onZoomChange* method when the user selects a new zoom factor using the Zoom Control on the application's control bar.

The action is defined as:

```ts
export const zoomChange = createAction(
  '[Sketchbook View Component] Zoom Change',
  props<{ zoomSelected: ZoomSelectType }>()
);
```

where *ZoomSelectType* is defined as:

```ts
export type ZoomSelectType = 'fit-to-window' | 'fit-to-width' | number;
```

The action sequence triggered is:

```text
SketchbookViewComponentActions.zoomChange
|
 - TransformEffects -> if the zoomSelected value is "fit-to-width" or
   zoomSelected$       "fit-to-window" then the effect handler computes the
   |                   zoom factor to achieve the desired result.
   |                   dispatch TransformEffectsActions.zoomChange
   |
    - pagesReducer -> pages = (modify current page to set new zoom factor)
   |
    - TransformEffects -> dispatch TransformEffects.pageWindowChange
      zoomChange$
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

## addPageClick

The *SketchbookViewComponentActions.addPageClick* is dispatched by the *SketchbookViewComponent* when the user clicks the add page button in the Page Selector control. The action is dispatched just before the component opens a New Dialog configured to capture the new page properties.

The action is defined as:

```ts
export const addPageClick = createAction(
  '[Sketchbook View Component] Add Page Click'
);
```

The action sequence triggered is:

```text
SketchbookViewComponentActions.addPageClick
|
 - sketchbookReducer -> dialogOpen = true
```

## addPageConfirmed

The *SketchbookViewComponentActions.addPageConfirmed* action is dispatched by the SketchViewComponent when the user completes the New Dialog with page properties. The action is defined as:

```t
export const addPageConfirmed = createAction(
  '[Sketchbook View Component] Add Page Confirmed',
  props<{ size: Size; format: PageFormats; layout: PageLayout }>()
);
```

The action sequence triggered is:

```text
SketchbookViewComponentActions.addPageConfirmed
|
 - sketchbookReducer -> dialogOpen = false
|
 - SketchbookEffects -> dispatch SketchbookEffectsActions.addPageReady
   addNewPage$
   |
    - pagesReducer -> pages = (add new page object)
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

## addPageCancel

The *SketchbookViewComponentActions.addPageCancelled* action is dispatched by the SketchViewComponent when the user cancels the New Dialog opened after clicking the add page button in the Page Selector control. The action is defined as:

```ts
export const addPageCancel = createAction(
  '[Sketchbook View Component] Add Page Cancel'
);
```

The action sequence triggered is:

```text
SketchbookViewComponentActions.addPageCancelled
|
 - sketchbookReducer -> dialogOpen = false
```

## currentPageChange

The *SketchbookViewComponentActions.currentPageChange* action is dispatched by the SketchViewComponent when the user selects a new current page using the Page Selector control. The action is defined as:

```ts
export const currentPageChange = createAction(
  '[Sketchbook View Component] Current Page Change',
  props<{ newCurrentPageIndex: number }>()
);
```

The action sequence triggered is:

```text
SketchbookViewComponentActions.currentPageChange
|
 - sketchbookReducer -> currentPageId = pageIds[newCurrentPageIndex]
|
 - SketchbookEffects -> dispatch SketchbookEffectsActions.currentPageChange
   currentPageChange$
   |
    - TransformEffects
      currentPageChange$ -> dispatch TransformEffectsActions.pageWindowChange
      |
       - pagesReducer -> pages = (update windowCentre property
      |                  of current page object)
      |
       - transformReducer => pageWindow, pageSize
      |
       - TransformEffects
         pageWindowChange$ -> dispatch TransformEffectsActions.transformChange
         |
          - transform.reducer -> transform
```

## deletePageClick

The *SketchbookViewComponentActions.deletePageClick* action is dispatched by the SketchViewComponent when the user deletes a page using the Page Selector control. The action is defined as:

```ts
export const deletePageClick = createAction(
  '[Sketchbook View Component] Delete Page Click',
  props<{ pageIndex: number; page: Page }>()
);
```

The action sequence triggered is:

```text
SketchbookViewComponentActions.deletePageClick
|
 - sketchbookReducer -> pageIds = (remove deleted page id)
|                       currentPageId = (next page or last page if last page
|                       deleted)
|                       status = 'modified'
|
 - SketchbookEffects -> dispatch SketchbookEffectsActions.deletePageClick
   deletePage$
   |
    - shapesReducer -> shapes = (shapes on page removed)
   |
    - pagesreducer -> pages = (remove deleted page object)
   |
    - SketchbookEffects -> dispatch SketchbookEffectsActions.currentPageChange
      currentPageChange$
      |
       - TransformEffects
         currentPageChange$ -> dispatch TransformEffectsActions.pageWindowChange
         |
          - pagesReducer -> pages = (update windowCentre property
         |                  of current page object)
         |
          - transformReducer => pageWindow, pageSize
         |
          - TransformEffects
            pageWindowChange$ -> dispatch TransformEffectsActions.transformChange
            |
             - transform.reducer -> transform
```

## pageOrderChange

The *SketchbookViewComponentActions.pageOrderChange* action is dispatched by the SketchViewComponent when the user moves a page tab in the Page Selector control. The action is defined as:

```ts
export const pageOrderChange = createAction(
  '[Sketchbook View Component] Page Order Change',
  props<{ move: MoveResult }>()
);
```

The action sequence triggered is:

```text
SketchbookViewComponentActions.pageOrderChange
|
 - sketchbookReducer -> pageIds = (rearrange pageId sequence to reflect new order)
```

## pageTitleChange

The *SketchbookViewComponentActions.pageTitleChange* action is dispatched by the SketchViewComponent when the user renames a page tab in the Page Selector control. The action is defined as:

```ts
export const pageTitleChange = createAction(
  '[Sketchbook View Component] Page Title Change',
  props<{ pageId: string; newTitle: string }>()
);
```

The action sequence triggered is:

```ts
SketchbookViewComponentActions.pageTitleChange
|
 - sketchbookReducer -> pages = (modify title of selected page)
```
