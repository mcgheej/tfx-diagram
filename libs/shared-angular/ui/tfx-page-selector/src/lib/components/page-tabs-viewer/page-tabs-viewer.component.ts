import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  inject,
  input,
  output,
} from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PageRenameDetails, PageTabClickData } from '../../page-selector.types';
import { PageTabComponent } from '../page-tab/page-tab.component';

@Component({
  selector: 'tfx-page-tabs-viewer',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule, PageTabComponent],
  templateUrl: './page-tabs-viewer.component.html',
  styleUrl: './page-tabs-viewer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageTabsViewerComponent {
  maxWidth = input(300);
  pages = input<string[]>([]);
  selectedPageIndex = input(-1);
  pageTabSelect = output<PageTabClickData>();
  pageRename = output<PageRenameDetails>();
  pageDelete = output<number>();

  @ViewChildren('tab', { read: ElementRef })
  pageTabRefs!: QueryList<ElementRef> | null;

  // Injected services
  private snackBar = inject(MatSnackBar);

  public onPageTabSelect(clickData: PageTabClickData) {
    this.pageTabSelect.emit(clickData);
  }

  public onPageRename(renameDetails: PageRenameDetails) {
    // Need to check if new name in use.
    let i = 0;
    for (const page of this.pages()) {
      if (page === renameDetails.newTitle) {
        if (i !== renameDetails.pageIndex) {
          this.snackBar.open('Name already in use!', undefined, {
            duration: 2000,
          });
        }
        return;
      }
      i++;
    }
    this.pageRename.emit(renameDetails);
  }

  public onPageDelete(pageIndex: number) {
    if (this.pages().length > 1) {
      this.pageDelete.emit(pageIndex);
    }
  }
}
