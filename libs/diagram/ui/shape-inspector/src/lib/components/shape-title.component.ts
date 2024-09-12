import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Shape } from '@tfx-diagram/diagram/data-access/shape-classes';

@Component({
  selector: 'tfx-shape-title',
  template: `
    <div *ngIf="shape" class="container">
      <tfx-icon-button
        class="icon-button"
        [config]="{
          iconName: expanded ? 'arrow_drop_down' : 'arrow_right',
          buttonType: 'rectangle'
        }"
        (buttonClick)="onToggleExpand()"
      ></tfx-icon-button>
      <div class="shape-type no-text-select">{{ shape.shapeType }}:</div>
      <div class="shape-id no-text-select">{{ shape.id }}</div>
    </div>
  `,
  styles: [
    `
      .container {
        width: 100%;
        display: grid;
        grid-template-columns: 24px 75px 1fr;
      }

      .shape-type {
        align-self: center;
        justify-self: end;
      }

      .shape-id {
        align-self: center;
        justify-self: start;
        margin-left: 2px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShapeTitleComponent {
  @Input() shape!: Shape;
  @Input() expanded = false;
  @Output() toggleExpansion = new EventEmitter<void>();

  onToggleExpand() {
    this.toggleExpansion.emit();
  }
}
