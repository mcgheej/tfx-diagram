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
  selector: 'tfx-lightness-slider',
  templateUrl: './lightness-slider.component.html',
  styleUrls: ['./lightness-slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LightnessSliderComponent implements AfterViewInit, OnChanges {
  @Input() hue = 0;
  @Input() saturation = 1;
  @Input() lightness = 0.5;
  @Output() lightnessChanged = new EventEmitter<number>();

  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  width = 32;
  height = 265;

  private ctx!: CanvasRenderingContext2D;
  private mousedown = false;
  private sliderHeight = this.height - 8;

  @HostListener('window:mouseup', ['$event'])
  onMouseUp() {
    this.mousedown = false;
  }

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d', {
      willReadFrequently: true,
    }) as CanvasRenderingContext2D;
    this.draw();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['hue'] || changes['saturation'] || changes['lightness']) {
      this.draw();
    }
  }

  onMouseDown(evt: MouseEvent) {
    this.mousedown = true;
    this.lightnessChanged.emit(this.getLightness(evt.offsetY));
  }

  onMouseMove(evt: MouseEvent) {
    if (this.mousedown) {
      this.lightnessChanged.emit(this.getLightness(evt.offsetY));
    }
  }

  onResize(resizeData: TfxResizeEvent) {
    this.width = resizeData.newRect.width;
    this.height = resizeData.newRect.height;
    this.sliderHeight = this.height - 8;
    this.sliderHeight = this.sliderHeight % 2 ? this.sliderHeight : this.sliderHeight - 1;
    this.changeDetector.detectChanges();
    this.draw();
  }

  draw() {
    if (this.ctx) {
      // const width = this.canvas.nativeElement.width;
      // const height = this.canvas.nativeElement.height;
      this.ctx.clearRect(0, 0, this.width, this.height);
      for (let y = 4; y < this.sliderHeight + 4; y++) {
        const lightness = ((this.sliderHeight - (y - 4)) / this.sliderHeight) * 100;
        const color = `hsl(${this.hue}, ${this.saturation * 100}%, ${lightness}%)`;
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.moveTo(10, y);
        this.ctx.lineTo(this.width - 11, y);
        this.ctx.stroke();
      }
      const y = this.sliderHeight - this.lightness * this.sliderHeight + 4;
      this.ctx.beginPath();
      this.ctx.fillStyle = 'black';
      this.ctx.moveTo(this.width - 7, y);
      this.ctx.lineTo(this.width - 1, y - 4);
      this.ctx.lineTo(this.width - 1, y + 4);
      this.ctx.lineTo(this.width - 7, y);
      this.ctx.fill();
    }
  }

  private getLightness(mouseY: number): number {
    let y = mouseY;
    if (y < 4) {
      y = 4;
    } else if (y > this.sliderHeight + 4) {
      y = this.sliderHeight + 4;
    }
    let value = (this.sliderHeight - (y - 4)) / this.sliderHeight;
    if (value < 0) {
      value = 0;
    } else if (value > 1) {
      value = 1;
    }
    return value;
  }
}
