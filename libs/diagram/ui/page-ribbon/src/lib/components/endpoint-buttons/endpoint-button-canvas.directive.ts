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
import { Endpoint } from '@tfx-diagram/diagram-data-access-shape-base-class';
import { selectScreenPixelDensity } from '@tfx-diagram/diagram-data-access-store-features-settings';
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
  private spd = 96;
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
        this.spd = sbd;
        this.draw();
      });
  }

  ngOnChanges(): void {
    if (this.spd !== 0) {
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

      // Calculate height and width of canvas in mm
      const scaleFactor = this.spd / 25.4;
      const transX = 0;
      const transY = 0;
      const mmWidth = this.width / scaleFactor;
      const mmHeight = this.height / scaleFactor;

      // Calculate coords of line endpoints and no endpoint label (x3)
      const mmY = mmHeight / 2;
      const mmX1 = this.end === 'finish' ? 1 : 3;
      const mmX2 = this.end === 'finish' ? mmWidth - 3 : mmWidth - 1;
      const pxX3 = ((mmX2 - mmX1) * scaleFactor) / 2;

      if (this.endpoint) {
        const line = new Line({
          id: 'temp',
          controlPoints: [
            { x: mmX1, y: mmY },
            { x: mmX2, y: mmY },
          ],
          lineWidth: 0.25,
          strokeStyle: { colorSet: 'rgb', ref: '#2a2b2d' },
        });
        if (this.end === 'start') {
          line.startEndpoint = this.endpoint;
        } else {
          line.finishEndpoint = this.endpoint;
        }
        line.draw(c, { scaleFactor, transX, transY });
      } else {
        c.fillStyle = '#2a2b2d';
        c.font = '12px Roboto, sans serif';
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText('None', pxX3, this.height / 2);
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

      // Calculate height and width of canvas in mm
      const scaleFactor = this.spd / 25.4;
      const transX = 0;
      const transY = 0;
      const mmWidth = this.width / scaleFactor;
      const mmHeight = this.height / scaleFactor;

      // Calculate coords of line endpoints and no endpoint label (x3)
      const mmY = mmHeight / 2;
      const mmX1 = this.end === 'finish' ? 1 : 3;
      const mmX2 = this.end === 'finish' ? mmWidth - 3 : mmWidth - 1;
      const pxX3 = ((mmX2 - mmX1) * scaleFactor) / 2;

      if (this.endpoint) {
        const line = new Line({
          id: 'temp',
          controlPoints: [
            { x: mmX1, y: mmY },
            { x: mmX2, y: mmY },
          ],
          lineWidth: 0.25,
          strokeStyle: { colorSet: 'rgb', ref: '#2a2b2d' },
        });
        if (this.end === 'start') {
          line.startEndpoint = this.endpoint;
        } else {
          line.finishEndpoint = this.endpoint;
        }
        line.draw(c, { scaleFactor, transX, transY });
      } else {
        c.fillStyle = '#2a2b2d';
        c.font = '12px Roboto, sans serif';
        c.textAlign = 'start';
        c.textBaseline = 'middle';
        c.fillText('None', pxX3, this.height / 2);
      }
    }
  }
}
