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
import { Endpoint } from '@tfx-diagram/diagram/data-access/endpoint-classes';
import { Line } from '@tfx-diagram/diagram/data-access/shape-classes';
import { Size } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Subject, takeUntil } from 'rxjs';

@Directive({
  selector: '[tfxEndpointButtonCanvas]',
})
export class EndpointButtonCanvasDirective implements OnInit, OnChanges, OnDestroy {
  @Input('tfxEndpointButtonCanvas') endpoint: Endpoint | null = null;
  @Input() end: 'start' | 'finish' = 'start';
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
      const y = this.height / 2;
      const x1 = 14;
      const x2 = this.width - 6;
      const x3 = (this.width - x1) / 2;
      c.fillStyle = '#2a2b2d';
      if (this.endpoint) {
        const line = new Line({
          id: 'temp',
          controlPoints: [
            { x: x1, y },
            { x: x2, y },
          ],
          lineWidth: 2,
          strokeStyle: { colorSet: 'rgb', ref: '#2a2b2d' },
        });
        if (this.end === 'start') {
          line.startEndpoint = this.endpoint;
        } else {
          line.finishEndpoint = this.endpoint;
        }
        line.draw(c, { scaleFactor: 1, transX: 0, transY: 0 });
      } else {
        c.font = '12px Roboto, sans serif';
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText('None', x3, y);
      }
      if (this.selected) {
        c.fillRect(0, 0, 4, this.height);
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

      if (this.endpoint) {
        const line = new Line({
          id: 'temp',
          controlPoints: [
            { x: x1, y },
            { x: x2, y },
          ],
          lineWidth: 2,
          strokeStyle: { colorSet: 'rgb', ref: '#2a2b2d' },
        });
        if (this.end === 'start') {
          line.startEndpoint = this.endpoint;
        } else {
          line.finishEndpoint = this.endpoint;
        }
        line.draw(c, { scaleFactor: 1, transX: 0, transY: 0 });
      } else {
        c.fillStyle = '#2a2b2d';
        c.font = '12px Roboto, sans serif';
        c.textAlign = 'start';
        c.textBaseline = 'middle';
        c.fillText('None', 6, y);
      }
    }
  }
}
