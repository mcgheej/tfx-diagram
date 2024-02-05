import { Injectable } from '@angular/core';
import { KeyboardStateService } from '@tfx-diagram/diagram/util/keyboard-state';
import { fromEvent, map, Observable, throttleTime } from 'rxjs';

export type DerivedWheelEvents =
  | 'zoomIn'
  | 'zoomOut'
  | 'scrollUp'
  | 'scrollDown'
  | 'scrollLeft'
  | 'scrollRight';

@Injectable({ providedIn: 'root' })
export class MouseWheelService {
  public events$: Observable<DerivedWheelEvents> = fromEvent<WheelEvent>(
    document,
    'wheel'
  ).pipe(
    throttleTime(50),
    map((event) => {
      if (this.keyboardState.pressed('KeyZ')) {
        if (event.deltaY > 0) {
          return 'zoomOut';
        }
        return 'zoomIn';
      }
      if (this.keyboardState.pressed('Space')) {
        if (event.deltaY > 0) {
          return 'scrollRight';
        }
        return 'scrollLeft';
      }
      if (event.deltaY > 0) {
        return 'scrollDown';
      }
      return 'scrollUp';
    })
  );

  constructor(private keyboardState: KeyboardStateService) {}
}
