import { Padding } from '@tfx-diagram/electron-renderer-web/shared-types';

/**
 * x:         X coord of the transformed text box top left corner in pixels.
 * y:         Y coord of the transformed text box top left corner in pixels.
 * width:     Width of the transformed text box in pixels.
 * height:    Height of the transformed text box in pixels.
 * fontSize:  Height of the scaled font size in pixels.
 * pxPadding: Scaled padding properties in pixels. The padding property specifies
 *            the distance between text content and the boundaries of the
 *            TextBlock rectangle
 */
export interface DrawingParams {
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  pxPadding: Padding;
}

/**
 * start: insert position of selection start
 * end:   insert position of selection end
 *
 * if start and end are equal then no text selected.
 * Note that end can be lower than start
 */
export interface SelectionSpan {
  start: number;
  end: number;
}
