import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Shape } from '@tfx-diagram/diagram-data-access-shape-base-class';

@Component({
  selector: 'tfx-shape',
  template: `
    <tfx-shape-title
      [shape]="shape"
      [expanded]="expanded"
      (toggleExpansion)="onToggleExpand()"
    ></tfx-shape-title>
    <tfx-shape-content *ngIf="expanded" [shape]="shape"></tfx-shape-content>
  `,
  // templateUrl: './shape.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShapeComponent {
  @Input() shape!: Shape;
  @Input() expanded = false;
  @Output() toggleExpansion = new EventEmitter<void>();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onToggleExpand() {
    this.toggleExpansion.emit();
  }
}
