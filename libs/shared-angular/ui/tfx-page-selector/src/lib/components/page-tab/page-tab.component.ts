import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  input,
  output,
} from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  ContextMenuService,
  FlexibleSubMenuPositioning,
  PopupMenuRef,
} from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { TfxShowIfTruncatedModule } from '@tfx-diagram/shared-angular/ui/tfx-show-if-truncated';
import { PageRenameDetails, PageTabClickData } from '../../page-selector.types';
import { PageTabInputComponent } from '../page-tab-input/page-tab-input.component';
import { DELETE_PAGE, PageTabMenuService, RENAME_PAGE } from './page-tab-menu.service';

@Component({
  selector: 'tfx-page-tab',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, PageTabInputComponent, TfxShowIfTruncatedModule],
  templateUrl: './page-tab.component.html',
  styleUrl: './page-tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PageTabMenuService],
})
export class PageTabComponent implements OnDestroy {
  page = input('unknown');
  pageIndex = input(-1);
  selectedPageIndex = input(-1);
  isOnlyPage = input(true);
  dragInProgress = input(false);
  pageTabSelect = output<PageTabClickData>();
  pageDelete = output<number>();
  pageRename = output<PageRenameDetails>();

  @ViewChild('titleContainer') titleContainer: ElementRef | null = null;

  editing = false;

  private menuRef: PopupMenuRef | null = null;

  constructor(
    private changeDetectRef: ChangeDetectorRef,
    private contextMenu: ContextMenuService,
    private pageTabMenu: PageTabMenuService
  ) {}

  ngOnDestroy() {
    if (this.menuRef) {
      this.menuRef.close();
    }
  }

  onMouseDownOnTab(ev: MouseEvent) {
    const button = ev.button === 0 ? 'left' : 'right';
    if (button === 'left') {
      // Prevent default behaviour to avoid element drag when
      // trying to move page tab with drag operation
      ev.preventDefault();
    }
    this.pageTabSelect.emit({
      pageIndex: this.pageIndex(),
      button,
    });
  }

  onDoubleClick() {
    this.editing = true;
  }

  openMenu(ev: MouseEvent) {
    ev.stopPropagation();
    ev.preventDefault();
    if (this.titleContainer) {
      this.menuRef = this.contextMenu.openContextMenu(
        this.pageTabMenu.getTabContextMenu(this.isOnlyPage()),
        {
          positioning: {
            type: 'Flexible',
            associatedElement: this.titleContainer,
            positions: [
              {
                originX: 'center',
                originY: 'top',
                overlayX: 'start',
                overlayY: 'bottom',
              },
            ],
          } as FlexibleSubMenuPositioning,
        }
      );
      this.menuRef.afterClosed().subscribe((item) => {
        const command = item.label;
        if (command === DELETE_PAGE) {
          this.pageDelete.emit(this.pageIndex());
        } else if (command === RENAME_PAGE) {
          this.editing = true;
          this.changeDetectRef.detectChanges();
        }
      });
    }
  }

  onEditCancel() {
    this.editing = false;
  }

  onEditComplete(newTitle: string) {
    this.editing = false;
    this.pageRename.emit({ pageIndex: this.pageIndex(), newTitle });
  }
}
