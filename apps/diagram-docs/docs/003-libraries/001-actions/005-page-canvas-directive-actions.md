---
sidebar_position: 6
custom_edit_url: null
---

# Page Canvas Directive Actions

## mouseMoveOnViewport

The *DiagramCanvasDirectiveActions.mouseMoveOnViewport* action is dispatched in response to mousemove events on the Page Viewport. Some throttling is applied to the raw mousemove events to reduce application overhead.

The action is defined as:

```ts
export const mouseMoveOnViewport = createAction(
  '[Page Viewport Component] Mouse Move On Viewport',
  props<{ coords: Point }>()
);
```

The action sequence triggered is:

```text
DiagramCanvasDirectiveActions.mouseMoveOnViewport
|
 - transformReducer -> viewportMouseCoords = (new value in pixel coords)
```
