import { Subject, filter, fromEvent } from 'rxjs';
import { PageTabClickData } from '../../../page-selector.types';

// Next emit generated when mouseLeftDownOnTab() function called
// by PageTabsViewrComponent when user presses left mouse button
// down while cursor over a page tab
const leftMouseDownOnTabSubject$ = new Subject<PageTabClickData>();
export const leftMouseDownOnTab$ = leftMouseDownOnTabSubject$.asObservable();

// Observable that emits a MouseEvent every time the mouse moves
export const mouseMove$ = fromEvent<MouseEvent>(document, 'mousemove');

// Observable that emits a MouseEvent every time the user releases
// the left mouse button
export const leftMouseUp$ = fromEvent<MouseEvent>(document, 'mouseup').pipe(
  filter((ev: MouseEvent) => ev.button === 0)
);

export function mouseLeftDownOnTab(clickData: PageTabClickData) {
  leftMouseDownOnTabSubject$.next(clickData);
}
