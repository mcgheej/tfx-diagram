import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { TfxResizeEvent } from '@tfx-diagram/shared-angular/utils/shared-types';
import { ScrollbarService } from '../scrollbar.service';
import { ScrollDirection } from '../scrollbar.types';

@Component({
  selector: 'tfx-scrollbar',
  templateUrl: './scrollbar.component.html',
  styleUrls: ['./scrollbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollbarComponent implements OnInit, OnChanges {
  @Input() direction: ScrollDirection = 'horizontal';
  @Input() offset!: number;
  @Input() size!: number;
  @Input() range!: number;
  @Output() scrolling = new EventEmitter<number>();
  @Output() scrollChange = new EventEmitter<number>();

  public thumbStyles!: { [klass: string]: number | string };
  public gutterStyles!: { [klass: string]: number | string };
  public containerStyles!: { [klass: string]: number | string };

  private gutterLength = 0;
  private thumbSize = 0;
  private lastOffset = 0;

  constructor(
    private changeDetect: ChangeDetectorRef,
    private scrollbarService: ScrollbarService
  ) {}

  ngOnInit(): void {
    if (this.direction === 'horizontal') {
      this.thumbStyles = {
        'height.%': 100,
        'width.px': this.thumbSize,
      };
      this.gutterStyles = {
        'width.%': 100,
        'height.%': 100,
        'align-self': 'center',
      };
      this.containerStyles = {
        display: 'grid',
        'grid-template-columns': '1fr',
      };
    } else {
      this.thumbStyles = {
        'width.%': 100,
        'height.px': this.thumbSize,
      };
      this.gutterStyles = {
        'width.%': 100,
        'height.%': 100,
        'justify-self': 'center',
      };
      this.containerStyles = {
        display: 'grid',
        'grid-template-rows': '1fr',
      };
    }
  }

  ngOnChanges(): void {
    if (this.gutterLength > 0) {
      this.updateScrollbar();
    }
  }

  onResize(resizeData: TfxResizeEvent) {
    this.gutterLength =
      this.direction === 'horizontal' ? resizeData.newRect.width : resizeData.newRect.height;
    this.updateScrollbar();
  }

  public onScroll(ev: MouseEvent) {
    const clickPos = this.direction === 'horizontal' ? ev.offsetX : ev.offsetY;
    const mmClickPos = (clickPos * this.range) / this.gutterLength;
    if (mmClickPos < this.offset) {
      if (mmClickPos <= 3) {
        this.lastOffset = 0;
      } else {
        this.lastOffset = mmClickPos;
      }
    } else if (mmClickPos >= this.offset + this.size) {
      if (this.range - mmClickPos <= 3) {
        this.lastOffset = this.range - this.size;
      } else {
        this.lastOffset = mmClickPos - this.size;
      }
    }
    this.scrollChange.emit(this.lastOffset);
  }

  public onMousedown(ev: MouseEvent) {
    if (this.size < this.range) {
      this.scrollbarService
        .dragScrolling(
          this.offset,
          this.direction,
          this.size,
          this.range,
          this.gutterLength,
          ev
        )
        // .subscribe((newOffset) => this.scrollOffset.emit(newOffset));
        .subscribe({
          next: (newOffset) => {
            this.lastOffset = newOffset;
            this.scrolling.emit(newOffset);
          },
          complete: () => {
            this.scrollChange.emit(this.lastOffset);
          },
        });
    }
    ev.stopPropagation();
    ev.preventDefault();
  }

  public onThumbClick(ev: MouseEvent) {
    ev.stopPropagation();
  }

  private updateScrollbar() {
    if (this.size >= this.range) {
      this.thumbSize = this.gutterLength;
    } else {
      this.thumbSize = Math.floor((this.gutterLength * this.size) / this.range);
    }
    if (this.direction === 'horizontal') {
      this.updateHorizontalStyles(this.offset);
    } else {
      this.updateVerticalStyles(this.offset);
    }
    this.changeDetect.detectChanges();
  }

  private updateHorizontalStyles(offset: number) {
    this.thumbStyles = {
      'height.%': 100,
      'width.px': this.thumbSize,
      'top.px': 0,
      'left.px': Math.floor((offset / this.range) * this.gutterLength),
    };
  }

  private updateVerticalStyles(offset: number) {
    this.thumbStyles = {
      'width.%': 100,
      'height.px': this.thumbSize,
      'top.px': Math.floor((offset / this.range) * this.gutterLength),
      'left.px': 0,
    };
  }
}
