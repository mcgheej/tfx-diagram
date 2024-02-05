import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'tfx-font-toggle-button',
  template: `
    <div class="button-container" [matTooltip]="tooltip" matTooltipShowDelay="2000">
      <div class="button">
        <tfx-icon-button
          *ngIf="!svg"
          [style.color]="highlighted ? 'rgb(16, 113, 229)' : 'inherit'"
          [style.backgroundColor]="highlighted ? 'rgb(207, 228, 255)' : 'inherit'"
          [config]="{ iconName, buttonType: 'rectangle', fontSizePx: 18 }"
          (buttonClick)="onClick()"
        ></tfx-icon-button>
        <div
          *ngIf="svg"
          class="svg-button"
          [style.color]="highlighted ? 'rgb(16, 113, 229)' : 'inherit'"
          [style.backgroundColor]="highlighted ? 'rgb(207, 228, 255)' : 'inherit'"
          [style.cursor]="'pointer'"
          (click)="onClick()"
        >
          <mat-icon class="svg-mat-icon" [svgIcon]="iconName"></mat-icon>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .button-container {
        height: 100%;
        width: 100%;
        display: grid;
      }

      .button {
        height: 90%;
        width: 80%;
        align-self: center;
        justify-self: center;
        border-radius: 4px;
        font-size: 18px;
      }

      .svg-button {
        display: grid;
        height: 100%;
        width: 100%;
      }

      .svg-mat-icon {
        align-self: center;
        justify-self: center;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FontToggleButtonComponent {
  @Input() iconName = '';
  @Input() tooltip = 'blank';
  @Input() highlighted: boolean | null = false;
  @Input() svg = false;
  @Output() buttonClick = new EventEmitter<void>();

  onClick() {
    this.buttonClick.emit();
  }
}
