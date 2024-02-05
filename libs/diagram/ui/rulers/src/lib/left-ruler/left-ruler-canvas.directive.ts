import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCurrentPage } from '@tfx-diagram/diagram-data-access-store-features-pages';
import {
  selectPageViewport,
  selectTransform,
  selectViewportMouseCoords,
} from '@tfx-diagram/diagram-data-access-store-features-transform';
import { getRectSize } from '@tfx-diagram/diagram/util/misc-functions';
import { Point, Size, Transform } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Subject, takeUntil, withLatestFrom } from 'rxjs';

@Directive({
  selector: '[tfxLeftRulerCanvas]',
})
export class LeftRulerCanvasDirective implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  private mousePositionDrawn = -1;
  private imgData: ImageData | null = null;
  private rulerStartY = -1;
  private rulerEndY = -1;

  constructor(private element: ElementRef, private store: Store) {}

  ngOnInit(): void {
    // If the transform changes then need to redraw the ruler
    this.store
      .select(selectTransform)
      .pipe(
        withLatestFrom(
          this.store.select(selectPageViewport),
          this.store.select(selectCurrentPage)
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(([transform, viewport, page]) => {
        if (transform && viewport && page) {
          this.drawRuler(transform, getRectSize(viewport), page.size);
        }
      });

    // Respond to mouse position changes in the viewport and draw
    // an indicator on the ruler to show the current y position
    this.store
      .select(selectViewportMouseCoords)
      .pipe(takeUntil(this.destroy$))
      .subscribe((mousePosition) => {
        this.drawMousePosition(mousePosition);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private drawMousePosition(mousePosition: Point) {
    const c = (this.element.nativeElement as HTMLCanvasElement).getContext('2d', {
      willReadFrequently: true,
    });
    if (c) {
      if (this.mousePositionDrawn >= 0 && this.imgData) {
        // Previous mouse position still drawn on canvas - remove
        // by restoring original ruler pixels.
        c.putImageData(this.imgData, 0, this.mousePositionDrawn - 1);
        this.imgData = null;
      }
      if (mousePosition.y >= this.rulerStartY && mousePosition.y <= this.rulerEndY) {
        // Save original ruler pixels at new mouse position and then
        // draw mouse position indicator.
        this.imgData = c.getImageData(0, mousePosition.y - 1, 16, 3);
        // draw mouse position indicator
        c.save();
        c.strokeStyle = '#e040fb';
        c.lineWidth = 1;
        c.globalAlpha = 0.75;
        c.beginPath();
        c.moveTo(0, mousePosition.y);
        c.lineTo(15, mousePosition.y);
        c.stroke();
        c.restore();
        this.mousePositionDrawn = mousePosition.y;
      }
    }
  }

  private drawRuler(t: Transform, viewportSize: Size, pageSize: Size): void {
    const c = (this.element.nativeElement as HTMLCanvasElement).getContext('2d', {
      willReadFrequently: true,
    });
    if (c) {
      this.mousePositionDrawn = -1;
      this.imgData = null;
      c.save();
      c.clearRect(0, 0, 16, viewportSize.height);
      c.strokeStyle = '#9f9fa1';
      c.fillStyle = '#9f9fa1';
      c.lineWidth = 1;
      c.font = '9px roboto';
      c.textAlign = 'left';
      const mmLineLength = 6;
      const xxLineLength = 8;
      const cmLineLength = 16;
      const x = cmLineLength;
      const increment = t.scaleFactor < 3.5 ? 2 : 1;
      let tickCount = 0;
      this.rulerStartY = t.scaleFactor * t.transY;
      this.rulerEndY = t.scaleFactor * (pageSize.height + t.transY);
      for (let i = 0; i <= pageSize.height; i += increment) {
        const y = t.scaleFactor * (i + t.transY);
        if (y >= 0 && y <= viewportSize.height) {
          c.beginPath();
          c.moveTo(x, y);
          const x2 =
            tickCount % 5 === 0
              ? tickCount % 10 === 0
                ? 0
                : x - xxLineLength + 1
              : x - mmLineLength + 1;
          c.lineTo(x2, y);
          c.stroke();
          if (tickCount % 10 === 0) {
            let yPos = y + 11;
            for (const digit of (i / 10).toString()) {
              c.fillText(digit, 2, yPos);
              yPos += 10;
            }
          }
        }
        tickCount++;
      }
      c.restore();
    }
  }
}
