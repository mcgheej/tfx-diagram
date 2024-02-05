/* eslint-disable @typescript-eslint/no-empty-function */
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tfx-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextMenuComponent {
  constructor() {}
}
