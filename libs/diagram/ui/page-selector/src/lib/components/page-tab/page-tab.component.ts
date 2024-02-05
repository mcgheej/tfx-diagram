import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { ContextMenuService, PopupMenuRef } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { PageRenameDetails } from '../../page-selector.types';
import { DELETE_PAGE, PageTabMenuService, RENAME_PAGE } from './page-tab-menu.service';

@Component({
  selector: 'tfx-page-tab',
  templateUrl: './page-tab.component.html',
  styleUrls: ['./page-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PageTabMenuService],
})
export class PageTabComponent implements OnDestroy {
  @Input() page = 'Unknown';
  @Input() pageIndex = -1;
  @Input() selectedPageIndex = -1;
  @Input() isLastPage = false;
  @Input() isOnlyPage = true;
  @Output() pageTabSelect = new EventEmitter<number>();
  @Output() pageDelete = new EventEmitter<number>();
  @Output() pageRename = new EventEmitter<PageRenameDetails>();
  @Output() tabMouseup = new EventEmitter<void>();

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

  onTabMouseup() {
    this.tabMouseup.emit();
  }

  onTabClick() {
    this.pageTabSelect.emit(this.pageIndex);
  }

  onDoubleClick() {
    this.editing = true;
  }

  openMenu(ev: MouseEvent) {
    ev.stopPropagation();
    ev.preventDefault();
    if (this.titleContainer) {
      this.menuRef = this.contextMenu.openContextMenu(
        this.pageTabMenu.getTabContextMenu(this.isOnlyPage),
        {
          associatedElement: this.titleContainer,
          positions: [
            {
              originX: 'center',
              originY: 'top',
              overlayX: 'start',
              overlayY: 'bottom',
            },
          ],
        }
      );
      this.menuRef.afterClosed().subscribe((item) => {
        const command = item.label;
        if (command === DELETE_PAGE) {
          this.pageDelete.emit(this.pageIndex);
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
    this.pageRename.emit({ pageIndex: this.pageIndex, newTitle });
  }
}
