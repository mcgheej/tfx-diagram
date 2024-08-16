import { Subject, filter, fromEvent, throttleTime } from 'rxjs';
import { PageTabClickData } from '../../../page-selector.types';

const leftMouseDownOnTabSubject$ = new Subject<PageTabClickData>();
export const leftMouseDownOnTab$ = leftMouseDownOnTabSubject$.asObservable();

// Observable that emits a MouseEvent at most every 20ms when the mouse is moved
export const mouseMove$ = fromEvent<MouseEvent>(document, 'mousemove').pipe(throttleTime(20));

// Observable that emits a MouseEvent every time the user releases
// the left mouse button
export const leftMouseUp$ = fromEvent<MouseEvent>(document, 'mouseup').pipe(
  filter((ev: MouseEvent) => ev.button === 0)
);

/**
 * Function called from the PageTabsViewer component when the user presses
 * down the left mouse button over a page tab currently displayed in the
 * Page Tab Viewer. The function simply emits the supplied PageTabClickData
 * object, supplied as a parameter to the function, on the
 * leftMouseDownOnTabSubject$ subject. This is exposed to interested
 * observers by the leftMouseDownOnTab$ observable (see above).
 */
export function mouseLeftDownOnTab(clickData: PageTabClickData) {
  leftMouseDownOnTabSubject$.next(clickData);
}
