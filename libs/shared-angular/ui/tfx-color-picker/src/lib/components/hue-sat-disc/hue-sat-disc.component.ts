import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ColorHSL, TfxResizeEvent } from '@tfx-diagram/shared-angular/utils/shared-types';

@Component({
  selector: 'tfx-hue-sat-disc',
  templateUrl: './hue-sat-disc.component.html',
  styleUrls: ['./hue-sat-disc.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HueSatDiscComponent implements AfterViewInit, OnChanges {
  @Input() hue = 0;
  @Input() saturation = 1;
  @Input() lightness = 0.5;
  @Output() valuesChanged = new EventEmitter<ColorHSL>();

  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  width = 257;
  height = 257;

  private ctx!: CanvasRenderingContext2D;
  private mousedown = false;
  private radius = (this.height - 9) / 2;
  private indicatorDrawn: { x: number; y: number } | null = null;
  private imageData: ImageData | null = null;

  @HostListener('window:mouseup', ['$event'])
  onMouseUp() {
    this.mousedown = false;
  }

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d', {
      willReadFrequently: true,
    }) as CanvasRenderingContext2D;
    this.width = this.canvas.nativeElement.width;
    this.height = this.canvas.nativeElement.height;
    this.radius = this.calcRadius(this.width, this.height);
    this.drawDisc();
    this.draw();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.ctx) {
      if (changes['hue'] || changes['saturation'] || changes['lightness']) {
        this.width = this.canvas.nativeElement.width;
        this.height = this.canvas.nativeElement.height;
        this.radius = this.calcRadius(this.width, this.height);
        this.draw();
      }
    }
  }

  onMouseDown(evt: MouseEvent) {
    this.mousedown = true;
    this.valuesChanged.emit(this.getValue(evt));
  }

  onMouseMove(evt: MouseEvent) {
    if (this.mousedown) {
      this.valuesChanged.emit(this.getValue(evt));
    }
  }

  onResize(resizeData: TfxResizeEvent) {
    this.width = resizeData.newRect.width;
    this.height = resizeData.newRect.height;
    this.radius = this.calcRadius(this.width, this.height);
    this.indicatorDrawn = null;
    this.changeDetector.detectChanges();
    this.drawDisc();
    this.draw();
  }

  drawDisc() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.width, this.height);
      const cx = Math.floor(this.width / 2);
      const cy = Math.floor(this.height / 2);
      for (let s = 100; s >= 0; s--) {
        for (let angle = 0; angle <= 360; angle++) {
          this.ctx.beginPath();
          this.ctx.moveTo(cx, cy);
          this.ctx.arc(
            cx,
            cy,
            (this.radius * s) / 100,
            ((angle - 2) * Math.PI) / 180,
            (angle * Math.PI) / 180
          );
          this.ctx.fillStyle = `hsl(${360 - angle}, ${s}%, 50%)`;
          this.ctx.fill();
        }
      }
    }
  }

  draw() {
    if (this.ctx) {
      const c = this.ctx;
      const s = this.saturation * this.radius;
      const cx = Math.floor(this.width / 2);
      const cy = Math.floor(this.height / 2);
      const h = (this.hue * Math.PI) / 180;
      const x = s * Math.cos(h) + cx;
      const y = cy - s * Math.sin(h);

      if (this.indicatorDrawn && this.imageData) {
        c.putImageData(this.imageData, this.indicatorDrawn.x - 7, this.indicatorDrawn.y - 7);
        this.imageData = null;
      }
      this.imageData = c.getImageData(x - 7, y - 7, 15, 15);

      c.beginPath();
      c.fillStyle = `hsl(${this.hue}, ${this.saturation * 100}%, ${this.lightness * 100}%)`;
      c.arc(x, y, 5, 0, 2 * Math.PI);
      c.fill();

      c.beginPath();
      c.lineWidth = 2;
      c.strokeStyle = 'black';
      c.arc(x, y, 5, 0, 2 * Math.PI);
      c.stroke();

      this.indicatorDrawn = { x, y };
    }
  }

  private getValue(evt: MouseEvent): ColorHSL {
    const { offsetX: x, offsetY: y } = evt;
    const cx = Math.floor(this.width / 2);
    const cy = Math.floor(this.height / 2);
    let s = Math.sqrt((x - cx) ** 2 + (y - cx) ** 2);
    if (s > this.radius) {
      s = this.radius;
    }
    let a = 90;
    if (x - cx === 0) {
      if (y >= 0) {
        a = 270;
      }
    } else {
      a = (180 * Math.atan(-(y - cy) / (x - cx))) / Math.PI;
      if (x - cx < 0) {
        a = 180 + a;
      } else if (y - cy > 0) {
        a = 360 + a;
      }
    }
    return {
      hue: a,
      saturation: s / this.radius,
      lightness: this.lightness,
    };
  }

  private calcRadius(width: number, height: number): number {
    const d = width > height ? height - 8 : width - 8;
    return Math.floor(d / 2);
  }
}
