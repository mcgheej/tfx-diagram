import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Endpoint } from '@tfx-diagram/diagram-data-access-shape-base-class';
import { Size } from '@tfx-diagram/electron-renderer-web/shared-types';

@Component({
  selector: 'tfx-finish-endpoint-button',
  template: `
    <div
      class="finish-endpoint-button"
      [matTooltip]="tooltipText"
      matTooltipShowDelay="2000"
      (click)="onClick()"
    >
      <div class="canvas-container">
        <canvas
          [tfxEndpointButtonCanvas]="endpoint"
          [end]="'finish'"
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

      .finish-endpoint-button {
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
export class FinishEndpointButtonComponent {
  @Input() endpoint: Endpoint | null = null;
  @Output() buttonClick = new EventEmitter<void>();

  width = 300;
  height = 300;

  tooltipText = 'Finish Endpoint';

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
