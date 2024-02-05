import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Point } from '@tfx-diagram/electron-renderer-web/shared-types';

@Component({
  selector: 'tfx-mouse-position',
  templateUrl: './mouse-position.component.html',
  styleUrls: ['./mouse-position.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MousePositionComponent {
  @Input() coords: Point = { x: 0, y: 0 };
  @Input() coordsFormat = '1.1-1';
}
