---
sidebar_position: 7
custom_edit_url: null
---

# Shell Component Actions

## appStart

The ShellComponentActions.appStart action is dispatched when the application starts, specifically when the Shell Component is initialising. The action is defined as;

```ts
export const appStart = createAction(
  '[Shell Component] App Start'
);
```

The action sequence triggered is:

```text
ShellComponentActions.appStart
|
 - SettingsEffects -> get persisted settings from local storage or defaults
   appStart$          dispatch SettingsEffectsActions.appStart
   |
    - settingsReducer -> initialise all settings with changes passed as prop
```
