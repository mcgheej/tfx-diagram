import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'tfx-color-button',
  template: `
    <div class="button-container" [matTooltip]="tooltip" matTooltipShowDelay="2000">
      <tfx-icon-button
        [config]="{ iconName, buttonType: 'rectangle', fontSizePx: 18 }"
        (buttonClick)="onClick()"
      ></tfx-icon-button>
      <div *ngIf="color; else noFill" class="color-bar" [style.backgroundColor]="color"></div>
      <ng-template #noFill>
        <div class="color-bar cross-hatch"></div>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .button-container {
        height: 100%;
        width: 100%;
        position: relative;
      }

      .color-bar {
        position: absolute;
        left: 11px;
        top: 22px;
        width: 18px;
        height: 3px;
        // background-color: red;
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
export class ColorButtonComponent {
  @Input() color = '';
  @Input() iconName = '';
  @Input() tooltip = 'blank';
  @Output() buttonClick = new EventEmitter<void>();

  onClick() {
    this.buttonClick.emit();
  }
}
