import { fromEvent, throttleTime } from 'rxjs';

export const mousemove$ = fromEvent<MouseEvent>(document, 'mousemove').pipe(throttleTime(50));
