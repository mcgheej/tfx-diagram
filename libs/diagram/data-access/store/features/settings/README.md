# diagram-data-access-store-features-settings

This library defines the NgRx state slice for application level properties that can be set by the user and persisted between application sessions.

## Settings State

The application settings that can be set by the user are specified by the interface _SettingsState_ (defined in the diagram-data-access-types lib).

```ts
export interface SettingsState {
  gridShow: boolean;
  gridSnap: boolean;
  gridSize: number;
  showRulers: boolean;
  screenPixelDensity: number;
  availableScreenPixelDensities: number[];
  pageAlignmentInViewport: Alignment;
  showMousePosition: boolean;
}
```
