import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Shape } from '@tfx-diagram/diagram-data-access-shape-base-class';

@Component({
  selector: 'tfx-shape-title',
  templateUrl: './shape-title.component.html',
  styleUrls: ['./shape-title.component.scss'],
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
