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

// TODO: Work on the ruler tick marking to provide a better experience
// at different zoom levels

@Directive({
  selector: '[tfxBottomRulerCanvas]',
})
export class BottomRulerCanvasDirective implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  private mousePositionDrawn = -1;
  private imgData: ImageData | null = null;
  private rulerStartX = -1;
  private rulerEndX = -1;

  constructor(private element: ElementRef, private store: Store) {}

  ngOnInit(): void {
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
        c.putImageData(this.imgData, this.mousePositionDrawn - 1, 0);
        this.imgData = null;
      }
      if (mousePosition.x >= this.rulerStartX && mousePosition.x <= this.rulerEndX) {
        // Save original ruler pixels at new mouse position and then
        // draw mouse position indicator.
        this.imgData = c.getImageData(mousePosition.x - 1, 0, 3, 16);
        // draw mouse position indicator
        c.save();
        c.strokeStyle = '#e040fb';
        c.lineWidth = 1;
        c.globalAlpha = 0.75;
        c.beginPath();
        c.moveTo(mousePosition.x, 0);
        c.lineTo(mousePosition.x, 15);
        c.stroke();
        c.restore();
        this.mousePositionDrawn = mousePosition.x;
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
      c.clearRect(0, 0, viewportSize.width, 16);
      c.strokeStyle = '#9f9fa1';
      c.fillStyle = '#9f9fa1';
      c.lineWidth = 1;
      c.font = '9px roboto';
      c.textAlign = 'left';
      const mmLineLength = 6;
      const xxLineLength = 8;
      const cmLineLength = 16;
      const increment = t.scaleFactor < 3.5 ? 2 : 1;
      let tickCount = 0;
      this.rulerStartX = t.scaleFactor * t.transX;
      this.rulerEndX = t.scaleFactor * (pageSize.width + t.transX);
      for (let i = 0; i <= pageSize.width; i += increment) {
        const x = t.scaleFactor * (i + t.transX);
        if (x >= 0 && x <= viewportSize.width) {
          c.beginPath();
          c.moveTo(x, 0);
          c.lineTo(
            x,
            tickCount % 5 === 0
              ? tickCount % 10 === 0
                ? cmLineLength - 1
                : xxLineLength - 1
              : mmLineLength - 1
          );
          c.stroke();
          if (tickCount % 10 === 0) {
            c.fillText((i / 10).toString(), x + 2, 14);
          }
        }
        tickCount++;
      }
      c.restore();
    }
  }
}
