import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { Size } from '@tfx-diagram/electron-renderer-web/shared-types';

@Component({
  selector: 'tfx-line-width-button',
  template: `
    <div
      class="line-width-button"
      [matTooltip]="tooltipText"
      matTooltipShowDelay="2000"
      (click)="onClick()"
    >
      <div class="canvas-container">
        <canvas
          [tfxLineWidthButtonCanvas]="lineWidth"
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
     
           .line-width-button {
             height: 60%;
             width: calc(100% - 6px);
             align-self: center;
             justify-self: end;
             border: 1px solid #888;
             background-color: white;
             border-radius: 4px 0 0 4px;
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
  // templateUrl: './line-width-button.component.html',
  // styleUrls: ['./line-width-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineWidthButtonComponent implements OnChanges {
  @Input() lineWidth = 0.5;
  @Output() buttonClick = new EventEmitter<void>();

  width = 300;
  height = 300;

  tooltipText = `Line Width`;

  constructor(private changeDetect: ChangeDetectorRef) {}

  ngOnChanges(): void {
    this.tooltipText = `Line Width: ${this.lineWidth}mm`;
  }

  onClick() {
    this.buttonClick.emit();
  }

  onCanvasSize(size: Size) {
    this.width = size.width;
    this.height = size.height;
    this.changeDetect.detectChanges();
  }
}
