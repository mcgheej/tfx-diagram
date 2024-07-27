import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TfxIconButtonModule } from '@tfx-diagram/shared-angular/ui/tfx-icon-button';

@Component({
  selector: 'tfx-page-tabs-overflow-button',
  standalone: true,
  imports: [CommonModule, TfxIconButtonModule],
  template: `
    <div class="container">
      <tfx-icon-button
        *ngIf="!disabled()"
        class="button"
        [config]="{
          iconName: 'more_horiz'
        }"
        width="24"
        highlightStyle="icon"
        (buttonClick)="onButtonClick()"
      ></tfx-icon-button>
    </div>
  `,
  styles: [
    `
      .container {
        height: 90%;
        display: grid;
        grid-template-columns: 1fr;
      }

      .button {
        justify-self: center;
        align-self: end;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageTabsOverflowButtonComponent {
  disabled = input(true);
  buttonClick = output<void>();

  public onButtonClick() {
    this.buttonClick.emit();
  }
}
