import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { PageSelectorMachineService } from '../../+xstate/page-selector-machine.service';
import { PageRenameDetails, TfxPoint } from '../../page-selector.types';

@Component({
  selector: 'tfx-page-tabs-viewer',
  templateUrl: './page-tabs-viewer.component.html',
  styleUrls: ['./page-tabs-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageTabsViewerComponent implements AfterViewInit, AfterViewChecked {
  @Input() maxWidth = 300;
  @Input() pages: string[] = [];
  @Input() selectedPageIndex = -1;
  @Input() scrollIndex = 0;
  @Output() pageTabSelect = new EventEmitter<number>();
  @Output() pageRename = new EventEmitter<PageRenameDetails>();
  @Output() pageDelete = new EventEmitter<number>();

  @ViewChildren('tab', { read: ElementRef })
  pageTabRefs!: QueryList<ElementRef> | null;

  private overflow = false;
  private tabInsertPoints: TfxPoint[] = [];

  constructor(
    private stateMachine: PageSelectorMachineService,
    private snackBar: MatSnackBar
  ) {}

  ngAfterViewInit() {
    (this.pageTabRefs as QueryList<ElementRef>).changes.subscribe(() => {
      this.checkOverflow();
    });
  }

  ngAfterViewChecked() {
    this.checkOverflow();
  }

  public onPageTabSelect(pageIndex: number) {
    this.stateMachine.moveStartDelay();
    this.pageTabSelect.emit(pageIndex);
  }

  public onPageRename(renameDetails: PageRenameDetails) {
    // Need to check if new name in use.
    let i = 0;
    for (const page of this.pages) {
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
    if (this.pages.length > 1) {
      this.pageDelete.emit(pageIndex);
    }
  }

  public onTabMouseup() {
    this.stateMachine.moveCancel();
  }

  // --------------------------------------------------------------------------

  private checkOverflow() {
    const tabGroupWidth = this.calcTabGroupWidth();
    const overflow = tabGroupWidth > this.maxWidth;
    if (overflow !== this.overflow) {
      this.overflow = overflow;
      this.stateMachine.tabViewerOverflowChanged(this.overflow);
      // this.overflowChange.emit(overflow);
    }
  }

  private calcTabGroupWidth(): number {
    const tabRefs = (this.pageTabRefs as QueryList<ElementRef>).toArray();
    let groupWidth = 0;
    const insertPoints: TfxPoint[] = [];
    let firstX = 0;
    let finalX = 0;
    let finalY = 0;
    let clipped = false;
    for (let i = 0; i < tabRefs.length; i++) {
      const boundingRect = tabRefs[i].nativeElement.getBoundingClientRect();
      if (i === 0) {
        firstX = boundingRect.x;
      }
      groupWidth += boundingRect.width;
      if (!clipped) {
        if (groupWidth > this.maxWidth) {
          clipped = true;
          insertPoints.push({
            x: Math.round(boundingRect.x),
            y: Math.round(boundingRect.y),
          });
          insertPoints.push({
            x: Math.round(firstX + this.maxWidth),
            y: Math.round(boundingRect.y),
          });
        } else {
          insertPoints.push({
            x: Math.round(boundingRect.x),
            y: Math.round(boundingRect.y),
          });
          finalX = boundingRect.x + boundingRect.width;
          finalY = boundingRect.y;
        }
      }
    }
    if (!clipped) {
      insertPoints.push({ x: Math.round(finalX), y: Math.round(finalY) });
    }
    if (this.insertPointsChanged(insertPoints)) {
      this.tabInsertPoints = insertPoints;
      this.stateMachine.tabInsertPointsChanged(this.tabInsertPoints);
      // this.insertPointsChange.emit(insertPoints);
    }
    return groupWidth;
  }

  private insertPointsChanged(insertPoints: TfxPoint[]): boolean {
    if (this.tabInsertPoints.length !== insertPoints.length) {
      return true;
    }
    for (let i = 0; i < insertPoints.length; i++) {
      if (
        insertPoints[i].x !== this.tabInsertPoints[i].x ||
        insertPoints[i].y !== this.tabInsertPoints[i].y
      ) {
        return true;
      }
    }
    return false;
  }
}
