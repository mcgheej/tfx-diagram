import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import {
  ContextMenuService,
  FlexibleSubMenuPositioning,
} from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { MousePositionContextMenuService } from './mouse-position-context-menu.service';

@Component({
  selector: 'tfx-mouse-position',
  templateUrl: './mouse-position.component.html',
  styleUrls: ['./mouse-position.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MousePositionContextMenuService],
})
export class MousePositionComponent {
  @Input() coords: Point = { x: 0, y: 0 };
  @Input() coordsFormat = '1.1-1';
  @Input() units = 'mm';

  @ViewChild('mousePosition') mousePositionElRef!: ElementRef;

  constructor(
    private contextMenuService: ContextMenuService,
    private contextMenu: MousePositionContextMenuService
  ) {}

  openContextMenu() {
    this.contextMenuService.openContextMenu(this.contextMenu.getContextMenu(), {
      positioning: {
        type: 'Flexible',
        associatedElement: this.mousePositionElRef,
        positions: [
          {
            originX: 'center',
            originY: 'center',
            overlayX: 'start',
            overlayY: 'bottom',
          },
        ],
      } as FlexibleSubMenuPositioning,
    });
  }
}
