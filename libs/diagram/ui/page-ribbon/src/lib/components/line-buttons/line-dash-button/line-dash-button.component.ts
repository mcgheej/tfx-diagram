import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Size } from '@tfx-diagram/electron-renderer-web/shared-types';

@Component({
  selector: 'tfx-line-dash-button',
  template: `
    <div
      class="line-dash-button"
      [matTooltip]="tooltipText"
      matTooltipShowDelay="2000"
      (click)="onClick()"
    >
      <div class="canvas-container">
        <canvas
          [tfxLineDashButtonCanvas]="lineDash"
          (canvasSize)="onCanvasSize($event)"
          class="canvas"
          [width]="width"
          [height]="height"
        ></canvas>
      </div>
      <tfx-icon-button
        [config]="{ iconName: 'arrow_drop_down', buttonType: 'rectangle', fontSizePx: 16 }"
      ></tfx-icon-button>
    </div>
  `,
  styles: [
    `
      :host {
        height: 100%;
        width: 100%;
        display: grid;
        grid-template-columns: 1fr;
      }

      .line-dash-button {
        height: 60%;
        width: calc(100% - 6px);
        align-self: center;
        justify-self: start;
        border-top: 1px solid #888;
        border-right: 1px solid #888;
        border-bottom: 1px solid #888;
        background-color: white;
        border-radius: 0 4px 4px 0;
        display: grid;
        grid-template-columns: 1fr 20px;
        grid-template-rows: 1fr;
      }

      .canvas-container {
        grid-area: 1 / 1 / 2 / 2;
        position: relative;
      }

      .canvas {
        position: absolute;
        height: 100%;
        width: 100%;
        cursor: pointer;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineDashButtonComponent {
  @Input() lineDash: number[] = [];
  @Output() buttonClick = new EventEmitter<void>();

  width = 300;
  height = 300;

  tooltipText = `Line Style`;

  constructor(private changeDetect: ChangeDetectorRef) {}

  onClick() {
    this.buttonClick.emit();
  }

  onCanvasSize(size: Size) {
    this.width = size.width;
    this.height = size.height;
    this.changeDetect.detectChanges();
  }
}
