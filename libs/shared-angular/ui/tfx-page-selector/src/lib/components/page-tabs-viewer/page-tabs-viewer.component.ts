import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnChanges,
  OnDestroy,
  QueryList,
  SimpleChanges,
  ViewChildren,
  inject,
  input,
  output,
} from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { PageRenameDetails, PageTabClickData } from '../../page-selector.types';
import { PageTabComponent } from '../page-tab/page-tab.component';
import { PageTabsViewerService } from './page-tabs-viewer.service';

@Component({
  selector: 'tfx-page-tabs-viewer',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule, PageTabComponent],
  templateUrl: './page-tabs-viewer.component.html',
  styleUrl: './page-tabs-viewer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageTabsViewerComponent implements OnChanges, AfterViewInit, OnDestroy {
  maxWidth = input(300);
  pages = input<string[]>([]);
  selectedPageIndex = input(-1);
  pageTabSelect = output<PageTabClickData>();
  pageRename = output<PageRenameDetails>();
  pageDelete = output<number>();

  @ViewChildren('tab', { read: ElementRef })
  pageTabRefs!: QueryList<ElementRef> | null;

  // Injected services
  viewerService = inject(PageTabsViewerService);

  private destroy$ = new Subject<void>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['maxWidth']) {
      this.viewerService.setViewerData(this.pageTabRefs, this.maxWidth());
    }
    if (changes['pages']) {
      console.log(this.pages());
    }
    if (changes['selectedPageIndex']) {
      console.log(`selectedPageIndex: ${this.selectedPageIndex()}`);
    }
  }

  ngAfterViewInit(): void {
    if (this.pageTabRefs) {
      console.log(this.pageTabRefs);
      this.viewerService.setViewerData(this.pageTabRefs, this.maxWidth());
      this.pageTabRefs.changes.pipe(takeUntil(this.destroy$)).subscribe((values) => {
        this.viewerService.setViewerData(values, this.maxWidth());
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onPageTabSelect(clickData: PageTabClickData) {
    this.pageTabSelect.emit(clickData);
  }

  public onPageRename(renameDetails: PageRenameDetails) {
    if (this.viewerService.pageNameAvailable(renameDetails, this.pages())) {
      this.pageRename.emit(renameDetails);
    }
  }

  public onPageDelete(pageIndex: number) {
    if (this.pages().length > 1) {
      this.pageDelete.emit(pageIndex);
    }
  }
}
