import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Shape } from '@tfx-diagram/diagram-data-access-shape-base-class';

@Component({
  selector: 'tfx-shape-content',
  templateUrl: './shape-content.component.html',
  styleUrls: ['./shape-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShapeContentComponent {
  @Input() shape!: Shape;
}
