import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Size } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Rect, TfxResizeEvent } from '@tfx-diagram/shared-angular/utils/shared-types';
import { Subject, fromEvent, takeUntil } from 'rxjs';
import {
  LeftButtonCtrlDown,
  LeftButtonDoubleClick,
  LeftButtonDown,
  LeftButtonUp,
  MouseMove,
} from '../+xstate/mouse-machine/mouse-machine.events';
import { MouseMachineService } from '../+xstate/mouse-machine/mouse-machine.service';
import { ShadowMouseMoveEvent } from '../canvas-directives/shadow-canvas.directive';
import { PageViewportComponentService } from './page-viewport.service';

@Component({
  selector: 'tfx-page-viewport',
  templateUrl: './page-viewport.component.html',
  styleUrls: ['./page-viewport.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PageViewportComponentService, MouseMachineService],
})
export class PageViewportComponent implements OnInit, OnDestroy {
  viewportSize: Size = { width: 300, height: 300 };

  vm$ = this.service.vm$;
  cursorType$ = this.service.cursorType$;

  private destroy$ = new Subject<void>();
  private mouseup$ = fromEvent<MouseEvent>(document, 'mouseup');

  constructor(
    private service: PageViewportComponentService,
    private mouseMachine: MouseMachineService,
    private changeDetect: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.mouseup$.pipe(takeUntil(this.destroy$)).subscribe((ev: MouseEvent) => {
      if (ev.button === 0) {
        this.mouseMachine.send({ type: 'leftButton.up' } as LeftButtonUp);
      }
    });
    this.service.start();
    this.mouseMachine.start();
    this.service.viewportSizeChange(this.viewportSize);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.mouseMachine.stop();
    this.service.viewportSizeChange(null);
  }

  /**
   *
   * @param resizeData
   *
   * This is called when the TfxResizeObserver directive emits a resize
   * event. The canvas element must be resized before the viewport state
   * is updated with the new size (eventually resulting in a new page
   * window to viewport transform calculation). This is necessary as resizing
   * the canvas element clears the canvas content. As all drawing services
   * are triggered by state change if the canvas isn't resized before the
   * state is updated then all refreshed canvas content will be erased by
   * the canvas element resize.
   *
   * Force the canvas element resize by calling detectChanges() after
   * setting the viewport size property, then dispatch new viewport size
   * to the Store.
   */
  onResize(resizeData: TfxResizeEvent) {
    this.viewportSize = {
      width: resizeData.newRect.width,
      height: resizeData.newRect.height,
    };
    this.changeDetect.detectChanges();
    this.service.viewportSizeChange(this.viewportSize);
  }

  scrollVertically(newY: number, pageId: string, pageWindow: Rect) {
    this.service.updateScrolling(pageId, { ...pageWindow, y: newY });
  }

  scrollHorizontally(newX: number, pageId: string, pageWindow: Rect) {
    this.service.updateScrolling(pageId, { ...pageWindow, x: newX });
  }

  onScrollVerticalChange(newY: number, pageId: string, pageWindow: Rect) {
    this.service.scrollChange(pageId, { ...pageWindow, y: newY });
  }

  onScrollHorizontalChange(newX: number, pageId: string, pageWindow: Rect) {
    this.service.scrollChange(pageId, { ...pageWindow, x: newX });
  }

  onMouseMove(ev: ShadowMouseMoveEvent) {
    this.mouseMachine.send({
      type: 'mouse.move',
      x: ev.x,
      y: ev.y,
      shapeIdUnderMouse: ev.shapeIdUnderMouse,
    } as MouseMove);
  }

  onMouseDown(ev: MouseEvent) {
    if (ev.button !== 0) {
      return;
    }
    if (ev.ctrlKey) {
      this.mouseMachine.send({ type: 'leftButton.ctrlDown' } as LeftButtonCtrlDown);
    } else {
      this.mouseMachine.send({
        type: 'leftButton.down',
        x: ev.offsetX,
        y: ev.offsetY,
      } as LeftButtonDown);
    }
    ev.stopPropagation();
    ev.preventDefault();
  }

  onDoubleClick() {
    this.mouseMachine.send({ type: 'leftButton.doubleClick' } as LeftButtonDoubleClick);
  }
}
