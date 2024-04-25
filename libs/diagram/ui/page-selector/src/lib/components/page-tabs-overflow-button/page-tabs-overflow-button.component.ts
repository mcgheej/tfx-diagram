import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

// TODO - not sure what width and highlightStyle attributes are doing
// in the tfx-icon-button element
@Component({
  selector: 'tfx-page-tabs-overflow-button',
  template: `
    <div class="container">
      <tfx-icon-button
        *ngIf="!disabled"
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
  @Input() disabled = false;
  @Output() buttonClick = new EventEmitter<void>();

  public onButtonClick() {
    this.buttonClick.emit();
  }
}
