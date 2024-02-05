import { IconButtonConfig } from '@tfx-diagram/shared-angular/ui/tfx-icon-button';

/**
 * Windows usually display three control buttons on the right
 * side of their title bar; a minimize window button, a restore down
 * window button or maximize window button, and a close window button
 */

/**
 * When the minimize control button is clicked the window
 * will be minimized. The button is rendered as an icon with a
 * rectangular highlight area.
 */
export const minimizeButtonConfig: IconButtonConfig = {
  id: 'minimize',
  iconName: 'remove',
  buttonType: 'rectangle',
  highlightBehaviour: 'lighten',
  fontSizePx: 18,
  cursorType: 'default',
};

/**
 * The restore down control button is displayed when the
 * window is maximized. When therestore down control
 * button is clicked the window will resized and positioned
 * to the same state it was in prior to the window being
 * maximized.
 */
export const restoreDownButtonConfig: IconButtonConfig = {
  id: 'restore-down',
  iconName: 'filter_none',
  buttonType: 'rectangle',
  highlightBehaviour: 'lighten',
  rotation: '180deg',
  fontSizePx: 16,
  cursorType: 'default',
};

/**
 * The miximize control button is displayed when the window
 * is not maximized but not maximized. When the maximize
 * control button is clicked the window will be maximized.
 */
export const maximizeButtonConfig: IconButtonConfig = {
  id: 'maximize',
  iconName: 'crop_square',
  buttonType: 'rectangle',
  highlightBehaviour: 'lighten',
  fontSizePx: 18,
  cursorType: 'default',
};

/**
 * The close control button is always displayed when the
 * window is visible. When the close control button is
 * clicked the application will close immediately, provided
 * any open document has been saved. If an opened document
 * has not been saved the the user will be asked to save
 * any changes, cancel the application close, or lose all
 * changes and continue to close the application.
 */
export const closeButtonConfig: IconButtonConfig = {
  id: 'close',
  iconName: 'close',
  buttonType: 'rectangle',
  highlightBehaviour: {
    colour: 'white',
    backgroundColour: 'red',
  },
  fontSizePx: 18,
  cursorType: 'default',
};
