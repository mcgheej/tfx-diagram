import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  output,
} from '@angular/core';
import { Endpoint } from '@tfx-diagram/diagram-data-access-shape-base-class';
import { Size } from '@tfx-diagram/electron-renderer-web/shared-types';

@Component({
  selector: 'tfx-endpoint-option',
  template: `
    <div *ngIf="endpoint && endpoint.availableSizes.length > 1" class="button">
      <tfx-icon-button
        class="button-icon"
        [config]="{ iconName: 'filter_list', buttonType: 'rectangle', rotation: '180deg' }"
        matTooltip="Cycle Sizes"
        matTooltipShowDelay="1000"
        (buttonClick)="clickSizeChange.emit()"
      ></tfx-icon-button>
    </div>
    <div class="canvas-container" (click)="clickEndpoint.emit()">
      <canvas
        class="canvas"
        [tfxEndpointButtonCanvas]="endpoint"
        [format]="'option'"
        [selected]="selected"
        [end]="end"
        (canvasSize)="onCanvasSize($event)"
        [width]="width"
        [height]="height"
      ></canvas>
    </div>
  `,
  styles: [
    `
      :host {
        height: 100%;
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 32px;
        grid-template-rows: 1fr;
      }

      .button {
        grid-area: 1 / 2 / 2 / 3;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
      }

      .button-icon {
        align-self: center;
        justify-self: center;
        height: 24px;
        width: 24px;
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
export class EndpointOptionComponent {
  @Input() endpoint: Endpoint | null = null;
  @Input() selected = false;
  @Input() end: 'start' | 'finish' = 'start';
  clickEndpoint = output<void>();
  clickSizeChange = output<void>();

  width = 300;
  height = 300;

  constructor(private changeDetect: ChangeDetectorRef) {}

  onCanvasSize(size: Size) {
    this.width = size.width;
    this.height = size.height;
    this.changeDetect.detectChanges();
  }
}
