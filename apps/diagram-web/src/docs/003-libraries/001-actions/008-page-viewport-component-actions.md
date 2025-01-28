---
sidebar_position: 9
custom_edit_url: null
---

# Page Viewport Component Actions

## viewportSizeChange

The *PageViewportComponentActions.viewportSizeChange* is dispatched by the PageViewportComponent when it is initialised and whenever the size of the viewport changes (detected by a resize observer). When the component is destroyed the action is dispatched with a newSize value set to null.

The action is defined as:

```ts
export const viewportSizeChange = createAction(
  '[Page Viewport Component] Viewport Size Change',
  props<{ newSize: Size | null }>()
);
```

The action sequence triggered is:

```text
PageViewportComponentActions.viewportSizeChange
|
 - transformReducer -> pageViewport = (set to newSize passed as action prop)
|
 - TransformEffects -> TransformEffectsAction.pageWindowChange
   viewportSizeChange$
   |
    - pagesReducer -> pages = (update windowCentre property
   |                  of current page object)
   |
    - transformReducer => pageWindow, pageSize
   |
    - TransformEffects -> dispatch TransformEffectsActions.transformChange
      pageWindowChange$
      |
       - transform.reducer -> transform
```

## scrolling

The *PageViewportComponentActions.scrolling* action is dispatched by the PageViewportComponent when it receives a scrolling event from the TfxScrollbarComponent. The action is defined as:

```ts
export const scrolling = createAction(
  '[Page Viewport Component] Scrolling',
  props<{ pageId: string; newWindow: Rect }>()
);
```

The action sequence triggered is:

```text
PageViewportComponentActions.scrolling
|
 - transformReducer -> pageWindow = newWindow
|
 - pagesReducer -> pages = (change windowCentre for current page)
|
 - TransformEffects
   pageWindowChange$ -> dispatch TransformEffectsActions.transformChange
   |
    - transform.reducer -> transform
```

## scrollChange

The *PageViewportComponentActions.scrollChange* action is dispatched by the PageViewportComponent when it receives a scrollChange event from the TfxScrollbarComponent. The action is defined as:

```ts
export const scrollChange = createAction(
  '[Page Viewport Component] Scroll Change',
  props<{ pageId: string; newWindow: Rect }>()
);
```

The action sequence triggered is:
