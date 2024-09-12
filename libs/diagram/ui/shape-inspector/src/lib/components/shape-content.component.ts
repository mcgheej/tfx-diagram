import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Shape } from '@tfx-diagram/diagram/data-access/shape-classes';

@Component({
  selector: 'tfx-shape-content',
  template: `
    <div class="container">
      <div *ngFor="let prop of shape.inspectorViewData()" class="detail-line">
        {{ prop.propName }}: {{ prop.value }}
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        width: 100%;
        margin-bottom: 5px;
      }

      .detail-line {
        margin-left: 24px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShapeContentComponent {
  @Input() shape!: Shape;
}
