import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { IconButtonConfig } from '@tfx-diagram/shared-angular/ui/tfx-icon-button';
import { AppMenu } from '@tfx-diagram/shared-angular/ui/tfx-menu';

@Component({
  selector: 'tfx-app-bar',
  templateUrl: './app-bar.component.html',
  styleUrls: ['./app-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppBarComponent implements OnChanges, OnDestroy, AfterViewInit {
  @Input() appTitle = '';
  @Input() menu!: AppMenu;
  @Input() controlButtonConfigs: IconButtonConfig[] = [];
  @Input() lowerZAppBar = false;
  @Output() controlButtonClick = new EventEmitter<number>();

  @ViewChild('appBar') appBarElRef: ElementRef | null = null;
  @ViewChild('appMenu') appMenuElRef: ElementRef | null = null;
  @ViewChild('appBarTitle') appTitleElRef: ElementRef | null = null;

  public readonly letterSpacing = -0.11;
  public titleX = 600;
  public titleCentred = true;

  private resizeObserver: ResizeObserver | null = null;
  private afterViewInit = false;
  private titleWidth = 0;

  constructor(private changeDetectRef: ChangeDetectorRef) {}

  ngOnChanges(): void {
    if (this.afterViewInit) {
      this.titleWidth = this.getTextWidth(this.appTitle, this.letterSpacing, this.appBarElRef);
      this.processResize();
      this.changeDetectRef.detectChanges();
    }
  }

  ngAfterViewInit() {
    this.titleWidth = this.getTextWidth(this.appTitle, this.letterSpacing, this.appBarElRef);
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    this.resizeObserver = new ResizeObserver(() => {
      this.processResize();
      this.changeDetectRef.detectChanges();
    });
    this.afterViewInit = true;
    this.resizeObserver.observe(this.appTitleElRef?.nativeElement);
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  onControlButtonClick(index: number) {
    this.controlButtonClick.emit(index);
  }

  private processResize() {
    this.titleX = this.appBarElRef?.nativeElement.clientWidth / 2 - this.titleWidth / 2;
    const appMenuEl = this.appMenuElRef?.nativeElement;
    const limit = appMenuEl.getClientRects()[0].x + appMenuEl.clientWidth + 5;
    if (this.titleX < limit) {
      this.titleCentred = false;
    } else {
      this.titleCentred = true;
    }
  }

  private getTextWidth(
    text: string,
    letterSpacing: number,
    elementRef: ElementRef | null
  ): number {
    const canvas = document.createElement('canvas');
    canvas.style.letterSpacing = '2px';
    const context = canvas.getContext('2d', {
      willReadFrequently: true,
    });
    if (context) {
      context.font = getComputedStyle(elementRef?.nativeElement).font;
      return Math.floor(
        context.measureText(text).width + (this.appTitle.length - 1) * letterSpacing
      );
    }
    return 0;
  }
}
