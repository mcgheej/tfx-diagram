import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCurrentPage } from '@tfx-diagram/diagram-data-access-store-features-pages';
import { selectGridShow } from '@tfx-diagram/diagram-data-access-store-features-settings';
import {
  selectPageViewport,
  selectTransform,
} from '@tfx-diagram/diagram-data-access-store-features-transform';
import { Size, Transform } from '@tfx-diagram/electron-renderer-web/shared-types';
import { combineLatest, Subject, takeUntil, withLatestFrom } from 'rxjs';

@Directive({
  selector: '[tfxPageCanvas]',
})
export class PageCanvasDirective implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(private readonly element: ElementRef, private store: Store) {}

  ngOnInit(): void {
    const c = (this.element.nativeElement as HTMLCanvasElement).getContext('2d');
    if (c) {
      combineLatest([this.store.select(selectTransform), this.store.select(selectGridShow)])
        .pipe(
          withLatestFrom(
            this.store.select(selectCurrentPage),
            this.store.select(selectPageViewport)
          ),
          takeUntil(this.destroy$)
        )
        .subscribe(([[transform, gridShow], page, viewport]) => {
          if (transform && page && viewport && this.element) {
            c.clearRect(0, 0, viewport.width, viewport.height);
            this.drawPage(page.size, transform, c);
            if (gridShow) {
              this.drawGrid(page.size, transform);
            }
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private drawPage(pageSize: Size, t: Transform, c: CanvasRenderingContext2D): void {
    c.save();
    c.fillStyle = 'white';
    c.fillRect(
      t.scaleFactor * t.transX,
      t.scaleFactor * t.transY,
      t.scaleFactor * pageSize.width,
      t.scaleFactor * pageSize.height
    );
    c.restore();
  }

  private drawGrid(pageSize: Size, t: Transform): void {
    const c = (this.element.nativeElement as HTMLCanvasElement).getContext('2d', {
      alpha: false,
      willReadFrequently: true,
    });
    if (c) {
      c.save();
      c.beginPath();
      c.strokeStyle = '#eeeeee';
      c.lineWidth = 1;
      const y1 = t.scaleFactor * t.transY;
      const y2 = t.scaleFactor * (pageSize.height + t.transY);
      const step = 5;
      for (let i = step; i < pageSize.width; i += step) {
        const x = t.scaleFactor * (i + t.transX);
        c.moveTo(x, y1);
        c.lineTo(x, y2);
      }
      const x1 = t.scaleFactor * t.transX;
      const x2 = t.scaleFactor * (pageSize.width + t.transX);
      for (let i = step; i < pageSize.height; i += step) {
        const y = t.scaleFactor * (i + t.transY);
        c.moveTo(x1, y);
        c.lineTo(x2, y);
      }
      c.stroke();
      c.restore();
    }
  }
}
