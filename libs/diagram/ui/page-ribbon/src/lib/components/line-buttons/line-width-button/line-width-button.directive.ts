import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { selectScreenPixelDensity } from '@tfx-diagram/diagram-data-access-store-features-settings';
import { Size } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Subject, takeUntil } from 'rxjs';

@Directive({
  selector: '[tfxLineWidthButtonCanvas]',
})
export class LineWidthButtonCanvasDirective implements OnInit, OnChanges, OnDestroy {
  @Input('tfxLineWidthButtonCanvas') lineWidth = 0.5;
  @Input() format: 'button' | 'option' = 'button';
  @Input() selected = false;
  @Output() canvasSize = new EventEmitter<Size>();

  private ctx: CanvasRenderingContext2D | null = null;
  private sbd = 0;
  private width = 300;
  private height = 300;

  private destroy$ = new Subject<void>();

  constructor(private readonly element: ElementRef, private store: Store) {}

  ngOnInit(): void {
    const { clientWidth: width, clientHeight: height } = this.element
      .nativeElement as HTMLCanvasElement;
    this.width = (this.element.nativeElement as HTMLCanvasElement).clientWidth;
    this.height = (this.element.nativeElement as HTMLCanvasElement).clientHeight;
    this.canvasSize.emit({ width, height });
    this.ctx = (this.element.nativeElement as HTMLCanvasElement).getContext('2d', {
      willReadFrequently: true,
    });
    this.store
      .select(selectScreenPixelDensity)
      .pipe(takeUntil(this.destroy$))
      .subscribe((sbd) => {
        this.sbd = sbd;
        this.draw();
      });
  }

  ngOnChanges(): void {
    if (this.sbd !== 0) {
      this.draw();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private draw() {
    if (this.format === 'button') {
      this.drawButton();
    } else {
      this.drawOption();
    }
  }

  private drawOption() {
    if (this.ctx) {
      const c = this.ctx;
      c.clearRect(0, 0, this.width, this.height);
      c.font = '12px Roboto, sans serif';
      c.textAlign = 'center';
      c.textBaseline = 'top';
      c.fillStyle = '#2a2b2d';
      const cy = this.height / 2;
      c.fillText(`${this.lineWidth}mm`, this.width / 2, cy + 5);
      const length = this.width * 0.8;
      const x1 = (this.width - length) / 2;
      const x2 = x1 + length;
      let lineWidth = (this.lineWidth * this.sbd) / 25.4;
      if (lineWidth < 1) {
        lineWidth = 1;
      }
      c.strokeStyle = '#2a2b2d';
      c.lineWidth = lineWidth;
      c.beginPath();
      c.moveTo(x1, cy - 5);
      c.lineTo(x2, cy - 5);
      c.stroke();

      if (this.selected) {
        c.lineWidth = 2;
        c.strokeStyle = 'red';
        c.strokeRect(0, 0, this.width, this.height);
      }
    }
  }

  private drawButton() {
    if (this.ctx) {
      const c = this.ctx;
      c.clearRect(0, 0, this.width, this.height);
      const y = this.height / 2;
      const x1 = 6;
      const x2 = this.width;
      let lineWidth = (this.lineWidth * this.sbd) / 25.4;
      if (lineWidth < 1) {
        lineWidth = 1;
      }
      c.strokeStyle = '#2a2b2d';
      c.lineWidth = lineWidth;
      c.beginPath();
      c.moveTo(x1, y);
      c.lineTo(x2, y);
      c.stroke();
    }
  }
}
