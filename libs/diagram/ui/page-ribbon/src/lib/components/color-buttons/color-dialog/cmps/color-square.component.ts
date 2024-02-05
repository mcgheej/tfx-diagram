import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'tfx-color-square',
  template: `
    <div class="square-container">
      <div
        [ngClass]="{
          'color-square': true,
          'color-square-highlighted': highlighted,
          'no-bottom-border': !showBottomBorder && !highlighted,
          'no-top-border': !showTopBorder && !highlighted,
          'cross-hatch': color === ''
        }"
        [style.backgroundColor]="color !== '' ? color : 'transparent'"
      ></div>
      <div *ngIf="highlighted" class="inner-square" [style.backgroundColor]="color"></div>
    </div>
  `,
  styles: [
    `
      :host {
        height: 100%;
        width: 100%;
      }

      .square-container {
        display: grid;
        height: 100%;
        width: 100%;
        grid-template-columns: 1px 1fr 1px;
        grid-template-rows: 1px 1fr 1px;
      }

      .color-square {
        grid-area: 1 / 1 / 4 / 4;
        box-sizing: border-box;
        border: 1px solid #e2e4e7;
        width: 100%;
        height: 100%;
      }

      .color-square-highlighted {
        border: 1px solid #f29436;
      }

      .no-bottom-border {
        border-bottom: none;
      }

      .no-top-border {
        border-top: none;
      }

      .inner-square {
        box-sizing: border-box;
        grid-area: 2 / 2 / 3 / 3;
        border: 1px solid #ffe294;
        width: 100%;
        height: 100%;
      }

      .cross-hatch {
        background-image: linear-gradient(
            45deg,
            lightgray 25%,
            transparent 25%,
            transparent 75%,
            lightgray 75%,
            lightgray
          ),
          linear-gradient(
            45deg,
            lightgray 25%,
            transparent 25%,
            transparent 75%,
            lightgray 75%,
            lightgray
          ),
          linear-gradient(#ffffff, #ffffff);
        background-size: 4px 4px, 4px 4px, 100% 100%;
        background-position: 0px 0px, 2px 2px, 0px 0px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorSquareComponent {
  @Input() color = '';
  @Input() highlighted = false;
  @Input() showTopBorder = true;
  @Input() showBottomBorder = true;
}
