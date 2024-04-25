import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { Endpoint } from '@tfx-diagram/diagram/data-access/endpoint-classes';
import { Size } from '@tfx-diagram/electron-renderer-web/shared-types';

@Component({
  selector: 'tfx-endpoint-option',
  template: `
    <div class="canvas-container">
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
             grid-template-columns: 1fr;
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
export class EndpointOptionComponent {
  @Input() endpoint: Endpoint | null = null;
  @Input() selected = false;
  @Input() end: 'start' | 'finish' = 'start';

  width = 300;
  height = 300;

  constructor(private changeDetect: ChangeDetectorRef) {}

  onCanvasSize(size: Size) {
    this.width = size.width;
    this.height = size.height;
    this.changeDetect.detectChanges();
  }
}
