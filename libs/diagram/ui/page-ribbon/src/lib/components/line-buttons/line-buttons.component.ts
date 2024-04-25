import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { LineDashButtonService } from './line-dash-button/line-dash-button.service';
import { LineWidthButtonService } from './line-width-button/line-width-button.service';

@Component({
  selector: 'tfx-line-buttons',
  template: `
    <div *ngIf="lineWidth" class="line-buttons">
      <tfx-line-width-button
        #lineWidthButton
        [lineWidth]="lineWidth"
        (buttonClick)="onLineWidthButtonClick()"
      ></tfx-line-width-button>
      <tfx-line-dash-button
        #lineDashButton
        [lineDash]="lineDash"
        (buttonClick)="onLineDashButtonClick()"
      ></tfx-line-dash-button>
    </div>
  `,
  styles: [
    `
           .line-buttons {
             border-right: 1px solid #dfe3e8;
             height: 100%;
             width: 180px;
             display: grid;
             grid-template-columns: 1fr 1fr;
           }
     
           .line-style-button {
             height: 60%;
             width: 90%;
             align-self: center;
             justify-self: start;
             border-top: 1px solid #888;
             border-right: 1px solid #888;
             border-bottom: 1px solid #888;
             background-color: white;
             border-radius: 0 4px 4px 0;
           }
         `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineButtonsComponent {
  @Input() lineWidth!: number;
  @Input() lineDash!: number[];

  @ViewChild('lineWidthButton', { read: ElementRef }) lineWidthButton!: ElementRef<HTMLElement>;
  @ViewChild('lineDashButton', { read: ElementRef }) lineDashButton!: ElementRef<HTMLElement>;

  constructor(
    private lineWidthService: LineWidthButtonService,
    private lineDashService: LineDashButtonService
  ) {}

  onLineWidthButtonClick() {
    if (this.lineWidthButton && this.lineWidth) {
      this.lineWidthService.openLineWidthDialog(
        this.lineWidthButton.nativeElement,
        this.lineWidth
      );
    }
  }

  onLineDashButtonClick() {
    if (this.lineDashButton && this.lineDash) {
      this.lineDashService.openLineDashDialog(this.lineDashButton.nativeElement, this.lineDash);
    }
  }
}
