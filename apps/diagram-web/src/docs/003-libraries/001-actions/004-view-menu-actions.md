---
sidebar_position: 5
custom_edit_url: null
---

# View Menu Actions

## showRulersToggle

The *ViewMenuActions.showRulersToggle* action is dispatched to the store when the user clicks the Show Rulers checkbox menu item. The result of this action is to toggle the visibility of rulers shown in the application sketchbook view.

The action is defined as:

```ts
export const showRulersToggle = createAction(
  '[View Menu] Show Rulers Toggle'
);
```

The action sequence triggered is:

```text
ViewMenuActions.showRulersToggle
|
 - SettingsEffects -> update local storage to persist the new show rulers
   |                  value
   |                  dispatch SettingsEffectsActions.showRulersToggle
   |
    - settingsReducer -> showRulers = !showRulers
```

## showMousePositionToggle

The *ViewMenuActions.showMousePositionToggle* action is dispatched when the user clicks the Show Position checkbox menu item. The result of this action is to toggle the display of the page viewport's mouse position in the page control bar at the bottom of the application window.

The action is defined as:

```ts
export const showMousePositionToggle = createAction(
  '[View Menu] Show Mouse Position Toggle'
);
```

The action sequence triggered is:

```text
ViewMenuActions.showMousePositionToggle
|
 - SettingsEffects -> update local storage to persist the new show mouse
   |                  position value
   |                  dispatch SettingsEffectsActions.showMousePositionToggle
   |
    - settingsReducer -> showMousePosition = !showMousePosition
```

## mousePositionCoordsTypeChange

The *ViewMenuActions.mousePositionCoordsTypeChange* action is dispatched when the user changes the mouse position coords from Page Coords to Viewport Coords, or vice-versa.

The action is defined as:

```ts
export const mousePositionCoordsTypeChange = createAction(
  '[View Menu] Mouse Position Coords Type Change',
  props<{ value: MousePositionCoordsType }>()
);
```

The action sequence triggered is:

```text
ViewMenuActions.mousePositionCoordsTypeChange
|
 - SettingsEffects -> update local storage to persist the new mouse
   |                  position coords type value
   |                  dispatch SettingsEffectsActions.mousePositionCoordsTypeChange
   |
    - settingsReducer -> mousePositionCoordsType = (new value)
```

## showGridToggle

The *ViewMenuActions.showGridToggle* action is dispatched when the user clicks the "View | Grid | Show Grid" menu item. The action is defined as:

```ts
export const showGridToggle = createAction(
  '[View Menu] Show Grid Toggle'
);
```

The action sequence triggered is:

```text
ViewMenuActions.showGridToggle
|
 - SettingsEffects -> update local storage to persist the new show grid value
   |                  dispatch SettingsEffectsActions.showGridToggle
   |
    - settingsReducer -> gridShow = !gridShow
```

## snapToGridToggle

The *ViewMenuActions.snapToGridToggle* action is dispatched when the user clicks the "View | Grid | Snap to Grid" menu item. The action is defined as:

```ts
export const snapToGridToggle = createAction(
  '[View Menu] Snap To Grid Toggle'
);
```

The action sequence triggered is:

```text
ViewMenuActions.snapToGridToggle
|
 - SettingsEffects -> update local storage to persist the new snap to grid value
   |                  dispatch SettingsEffectsActions.snapToGridToggle
   |
    - settingsReducer -> gridSnap = !gridSnap
```

## pageAlignmentChange

The *ViewMenuActions.pageAlignmentChange* action is dispatched when the user clicks a "View | Page Alignment" sub-menu checkbox item. The action is defined as:

```ts
export const pageAlignmentChange = createAction(
  '[View Menu] Page Alignment Change',
  props<{ value: Partial<Alignment> }>()
);
```

The action sequence triggered is:

```text
ViewMenuActions.pageAlignmentChange
|
 - SettingsEffects -> update local storage to persist the new page alignment value
   |                  dispatch SettingsEffectsActions.pageAlignmentChange
   |
    - settingsReducer -> pageAlignmentInViewport = (new value)
   |
    - TransformEffects
      alignmentChange$ -> calculate new page window and dispatch
      |                   TransformEffectsActions.pageWindowChange
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

## screenPixelDensityChange

The *ViewMenuActions.screenPixelDensityChange* action is dispatched when the user clicks a "View | Screen Pixel Density" sub-menu checkbox item. The action is defined as:

```ts
export const screenPixelDensityChange = createAction(
  '[View Menu] Screen Pixel Density Change',
  props<{ value: number }>()
);
```

The action sequence triggered is:

```text
ViewMenuActions.screenPixelDensityChange
|
 - SettingsEffects -> update local storage to persist the new screen pixel
   |                  density value
   |                  dispatch SettingsEffectsActions.screenPixelDensityChange
   |
    - settingsReducer -> screenPixelDensity = (new value)
   |
    - TransformEffects
      screenPixelDensityChange$ -> calculate new page window and dispatch
      |                            TransformEffectsActions.pageWindowChange
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
