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
import { TfxResizeEvent } from '@tfx-diagram/shared-angular/utils/shared-types';

@Component({
  selector: 'tfx-saturation-slider',
  templateUrl: './saturation-slider.component.html',
  styleUrls: ['./saturation-slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaturationSliderComponent implements AfterViewInit, OnChanges {
  @Input() hue = 0;
  @Input() saturation = 1;
  @Input() lightness = 0.5;
  @Output() saturationChanged = new EventEmitter<number>();

  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  width = 265;
  height = 32;

  private ctx!: CanvasRenderingContext2D;
  private mousedown = false;
  private sliderWidth = this.width - 8;

  @HostListener('window:mouseup', ['$event'])
  onMouseUp() {
    this.mousedown = false;
  }

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d', {
      willReadFrequently: true,
    }) as CanvasRenderingContext2D;
    // this.draw();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['hue'] || changes['saturation'] || changes['lightness']) {
      this.draw();
    }
  }

  onMouseDown(evt: MouseEvent) {
    this.mousedown = true;
    this.saturationChanged.emit(this.getSaturation(evt.offsetX));
  }

  onMouseMove(evt: MouseEvent) {
    if (this.mousedown) {
      this.saturationChanged.emit(this.getSaturation(evt.offsetX));
    }
  }

  onResize(resizeData: TfxResizeEvent) {
    this.width = resizeData.newRect.width;
    this.height = resizeData.newRect.height;
    this.sliderWidth = this.width - 8;
    this.sliderWidth = this.sliderWidth % 2 ? this.sliderWidth : this.sliderWidth - 1;
    this.changeDetector.detectChanges();
    this.draw();
  }

  private draw() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.width, this.height);
      for (let x = 4; x < this.sliderWidth + 4; x++) {
        const saturation = ((x - 4) / this.sliderWidth) * 100;
        const color = `hsl(${this.hue}, ${saturation}%, ${this.lightness * 100}%)`;
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.moveTo(x, 10);
        this.ctx.lineTo(x, this.height - 11);
        this.ctx.stroke();
      }
      const x = this.saturation * this.sliderWidth + 4;
      this.ctx.beginPath();
      this.ctx.fillStyle = 'black';
      this.ctx.moveTo(x, this.height - 7);
      this.ctx.lineTo(x - 4, this.height - 1);
      this.ctx.lineTo(x + 4, this.height - 1);
      this.ctx.lineTo(x, this.height - 7);
      this.ctx.fill();
    }
  }

  private getSaturation(mouseX: number): number {
    let x = mouseX;
    if (x < 4) {
      x = 4;
    } else if (x > this.sliderWidth + 4) {
      x = this.sliderWidth + 4;
    }
    let value = (x - 4) / this.sliderWidth;
    if (value < 0) {
      value = 0;
    } else if (value > 1) {
      value = 1;
    }
    return value;
  }
}
