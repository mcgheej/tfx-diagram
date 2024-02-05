import {
  Directive,
  ElementRef,
  EventEmitter,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Rect, TfxResizeEvent } from '@tfx-diagram/shared-angular/utils/shared-types';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[tfxResizeObserver]',
})
export class TfxResizeObserverDirective implements OnInit, OnDestroy {
  @Output() readonly tfxResizeObserver = new EventEmitter<TfxResizeEvent>();

  private observer: ResizeObserver;
  private oldRect?: Rect;

  private subscription: Subscription | null = null;

  constructor(private readonly element: ElementRef, private readonly zone: NgZone) {
    this.observer = new ResizeObserver(() => this.zone.run(() => this.observe()));
  }

  ngOnInit() {
    this.observer.observe(this.element.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.observer.disconnect();
  }

  private observe(): void {
    const newRect: Rect = {
      x: 0,
      y: 0,
      width: this.element.nativeElement.clientWidth,
      height: this.element.nativeElement.clientHeight,
    };
    const resizeEvent = new TfxResizeEvent(newRect, this.oldRect);
    this.oldRect = newRect;
    this.tfxResizeObserver.emit(resizeEvent);
  }
}
