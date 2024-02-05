import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { Size } from '@tfx-diagram/electron-renderer-web/shared-types';

@Component({
  selector: 'tfx-dash-option',
  template: `
    <div class="canvas-container">
      <canvas
        class="canvas"
        [tfxLineDashButtonCanvas]="lineDash"
        [format]="'option'"
        [selected]="selected"
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
export class DashOptionComponent {
  @Input() lineDash: number[] = [];
  @Input() selected = false;

  width = 300;
  height = 300;

  constructor(private changeDetect: ChangeDetectorRef) {}

  onCanvasSize(size: Size) {
    this.width = size.width;
    this.height = size.height;
    this.changeDetect.detectChanges();
  }
}
