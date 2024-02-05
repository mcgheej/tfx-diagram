import { Injectable } from '@angular/core';
import { from, fromEvent, Observable } from 'rxjs';
import { distinctUntilChanged, map, mapTo, takeUntil, throttleTime } from 'rxjs/operators';
import { ScrollDirection } from './scrollbar.types';

const mousemove$ = fromEvent<MouseEvent>(document, 'mousemove').pipe(throttleTime(50));
const finished$ = fromEvent(document, 'mouseup').pipe(mapTo('finished'));

@Injectable({
  providedIn: 'root',
})
export class ScrollbarService {
  private size!: number;
  private range!: number;
  private gutterLength!: number;

  private pxInitialMousePos!: number;
  private mmInitialOffset!: number;

  public dragScrolling(
    initialOffset: number,
    direction: ScrollDirection,
    size: number,
    range: number,
    gutterLength: number,
    mousedownEvent: MouseEvent
  ): Observable<number> {
    this.mmInitialOffset = initialOffset;
    this.size = size;
    this.range = range;
    this.gutterLength = gutterLength;
    this.pxInitialMousePos =
      direction === 'horizontal' ? mousedownEvent.clientX : mousedownEvent.clientY;
    return from(mousemove$).pipe(
      map((ev: MouseEvent) => (direction === 'horizontal' ? ev.clientX : ev.clientY)),
      map((pxMousePos: number) => this.getNewOffset(pxMousePos)),
      takeUntil(finished$),
      distinctUntilChanged()
    );
  }

  private getNewOffset(pxMousePos: number): number {
    const pxDelta = pxMousePos - this.pxInitialMousePos;
    const mmDelta = (pxDelta * this.range) / this.gutterLength;
    let mmTrackOffset = this.mmInitialOffset + mmDelta;
    if (mmTrackOffset < 0) {
      mmTrackOffset = 0;
    } else if (mmTrackOffset > this.range - this.size) {
      mmTrackOffset = this.range - this.size;
    }
    return mmTrackOffset;
  }
}
